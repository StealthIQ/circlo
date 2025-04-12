#include <Servo.h>

// Pins
const int trigPin = 9;
const int echoPin = 10;
const int firstServoPin = 11;
const int secondServoPin = 7;
const int inputPin = 2;

uint16_t SecondServoResponseDelay = 1000;
uint16_t SecondServoReturnDelay = 500;

// Servos
Servo myServo;
Servo secondServo;

// Ultrasonic
long duration;
int distance;
const int numReadings = 10;
int readings[numReadings];
int readIndex = 0;
int total = 0;
int averageDistance = 0;

// Timing and states
bool firstServoWentTo0 = false;
unsigned long firstServoAt0Time = 0;
int currentFirstServoPos = -1;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(inputPin, INPUT);

  Serial.begin(9600);

  myServo.attach(firstServoPin);
  secondServo.attach(secondServoPin);
  myServo.write(0);
  currentFirstServoPos = 0;
  secondServo.write(0);

  for (int i = 0; i < numReadings; i++) readings[i] = 0;
}

void loop() {
  // --- Ultrasonic Sensor ---
  digitalWrite(trigPin, LOW);
  delayMicroseconds(5);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH, 30000);
  distance = duration * 0.034 / 2;

  total = total - readings[readIndex];
  readings[readIndex] = distance;
  total = total + readings[readIndex];
  readIndex = (readIndex + 1) % numReadings;
  averageDistance = total / numReadings;

  Serial.print("Distance: ");
  Serial.println(averageDistance);

  unsigned long currentTime = millis();

  // --- Input Pin Check (LOW) ---
  if (digitalRead(inputPin) == LOW) {
    Serial.println("Input LOW → Moving second servo immediately");
    secondServo.write(180);
    delay(500);
    secondServo.write(0);
    firstServoWentTo0 = false;
  }

  // --- First Servo Control (Now checks for 10 cm) ---
  if (averageDistance < 10 && currentFirstServoPos != 180) {
    myServo.write(180);
    currentFirstServoPos = 180;
    firstServoWentTo0 = false; // reset delay flag
  } 
  else if (averageDistance >= 10 && currentFirstServoPos != 0) {
    myServo.write(0);
    currentFirstServoPos = 0;
    firstServoWentTo0 = true;
    firstServoAt0Time = currentTime;
    Serial.println("First servo moved to 0 — starting 5s delay");
  }

  // --- Second Servo after 5 seconds ---
  if (firstServoWentTo0 && (currentTime - firstServoAt0Time >= SecondServoResponseDelay)) {
    Serial.println("5 seconds passed → Moving second servo");
    secondServo.write(180);
    delay(SecondServoReturnDelay);
    secondServo.write(0);
    firstServoWentTo0 = false;
  }

  delay(50);
}
