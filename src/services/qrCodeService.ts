
import { supabase, QrCode, RecyclingActivity } from '@/integrations/supabase/client';
import { tables } from '@/utils/supabaseHelpers';
import { addUserPoints } from './profileService';

export const scanQrCode = async (code: string, userId: string) => {
  try {
    // Begin a transaction by using a single connection
    const { data: qrData, error: qrError } = await tables.qr_codes()
      .select('*')
      .eq('code', code)
      .eq('is_used', false)
      .single();
    
    if (qrError) {
      if (qrError.code === 'PGRST116') {
        return { 
          success: false, 
          message: 'QR code not found or already used', 
          error: qrError 
        };
      }
      throw qrError;
    }
    
    const qrCode = qrData as QrCode;
    
    // Update QR code to mark as used
    const { error: updateError } = await tables.qr_codes()
      .update({
        is_used: true,
        used_by: userId,
        used_at: new Date().toISOString()
      })
      .eq('id', qrCode.id);
    
    if (updateError) throw updateError;
    
    // Add recycling activity
    const { error: activityError } = await tables.recycling_activities()
      .insert({
        user_id: userId,
        points: qrCode.points,
        description: `QR code scanned: ${code}`,
        qr_code: code,
        item_id: qrCode.item_id
      });
    
    if (activityError) throw activityError;
    
    // Add points to user profile
    const { success: pointsSuccess, error: pointsError } = await addUserPoints(userId, qrCode.points);
    
    if (pointsError) throw pointsError;
    
    return {
      success: true,
      message: `Recycling registered successfully! You earned ${qrCode.points} points.`,
      points: qrCode.points,
      error: null
    };
  } catch (error) {
    console.error('Error scanning QR code:', error);
    return { 
      success: false, 
      message: 'Failed to process QR code scan', 
      error 
    };
  }
};

export const generateQrCode = async (itemId: string, points: number, createdBy: string) => {
  try {
    // Generate a unique code
    const code = `recyclebin:${Date.now()}:${Math.random().toString(36).substring(2, 8)}`;
    
    const { data, error } = await tables.qr_codes()
      .insert({
        code,
        item_id: itemId,
        points,
        created_by: createdBy,
        is_used: false
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { qrCode: data as QrCode, error: null };
  } catch (error) {
    console.error('Error generating QR code:', error);
    return { qrCode: null, error };
  }
};
