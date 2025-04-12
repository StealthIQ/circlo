
import { supabase, RewardProduct, RewardCoupon, RewardPartner, UserRedemption } from '@/integrations/supabase/client';
import { tables, rpc } from '@/utils/supabaseHelpers';
import { updateProfile, getProfileById } from './profileService';

export const getAllRewards = async () => {
  try {
    const { data: products, error: productsError } = await tables.reward_products()
      .select('*');
    
    const { data: coupons, error: couponsError } = await tables.reward_coupons()
      .select('*');
    
    const { data: partners, error: partnersError } = await tables.reward_partners()
      .select('*');
    
    if (productsError) throw productsError;
    if (couponsError) throw couponsError;
    if (partnersError) throw partnersError;
    
    return {
      products: products as RewardProduct[],
      coupons: coupons as RewardCoupon[],
      partners: partners as RewardPartner[],
      error: null
    };
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return { 
      products: [], 
      coupons: [], 
      partners: [], 
      error 
    };
  }
};

export const getUserRedemptions = async (userId: string) => {
  try {
    const { data, error } = await tables.user_redemptions()
      .select('*')
      .eq('user_id', userId)
      .order('redeemed_at', { ascending: false });
    
    if (error) throw error;
    
    return { redemptions: data as UserRedemption[], error: null };
  } catch (error) {
    console.error('Error fetching user redemptions:', error);
    return { redemptions: [], error };
  }
};

export const redeemReward = async (
  userId: string,
  redemptionType: 'product' | 'coupon' | 'partner',
  redemptionId: string,
  pointCost: number
) => {
  try {
    // Check user has enough points
    const { profile, error: profileError } = await getProfileById(userId);
    
    if (profileError || !profile) throw profileError;
    
    if (profile.points < pointCost) {
      return {
        success: false,
        message: 'Not enough points to redeem this reward',
        error: new Error('Insufficient points')
      };
    }
    
    // Subtract points from user profile
    const { error: updateError } = await updateProfile(userId, {
      points: profile.points - pointCost
    });
    
    if (updateError) throw updateError;
    
    // Record redemption
    const { data, error: redemptionError } = await tables.user_redemptions()
      .insert({
        user_id: userId,
        redemption_type: redemptionType,
        redemption_id: redemptionId,
        points_spent: pointCost,
        status: 'completed'
      })
      .select()
      .single();
    
    if (redemptionError) throw redemptionError;
    
    // If product, update stock
    if (redemptionType === 'product') {
      const { error: stockError } = await tables.reward_products()
        .update({ 
          stock: rpc.decrement(1)
        })
        .eq('id', redemptionId)
        .gt('stock', 0);
      
      if (stockError) {
        console.error('Error updating product stock:', stockError);
      }
    }
    
    return {
      success: true,
      redemption: data as UserRedemption,
      message: 'Reward redeemed successfully!',
      error: null
    };
  } catch (error) {
    console.error('Error redeeming reward:', error);
    return { 
      success: false, 
      redemption: null, 
      message: 'Failed to redeem reward', 
      error 
    };
  }
};
