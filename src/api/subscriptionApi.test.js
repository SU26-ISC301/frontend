import {
  canUpgradeSubscription,
  normalizeSubscriptionStatus,
  toStoredVendorPlan,
} from './subscriptionApi';

describe('normalizeSubscriptionStatus', () => {
  test('luôn xem Premium là gói không giới hạn', () => {
    expect(
      normalizeSubscriptionStatus({
        planType: 'Premium',
        totalSlots: 3,
        usedSlots: 8,
        canPost: false,
      }),
    ).toMatchObject({
      planType: 'premium',
      totalSlots: -1,
      remainingSlots: -1,
      canPost: true,
    });
  });

  test('áp dụng đúng 20 lượt cho gói Plus khi API thiếu hạn mức', () => {
    expect(
      normalizeSubscriptionStatus({ planType: 'plus', usedSlots: 7 }),
    ).toMatchObject({
      planType: 'plus',
      totalSlots: 20,
      usedSlots: 7,
      remainingSlots: 13,
      canPost: true,
    });
  });

  test('gói Free hết quyền đăng khi đã dùng đủ 3 lượt', () => {
    expect(
      toStoredVendorPlan({ planType: 'free', usedSlots: 3 }),
    ).toMatchObject({
      planId: 'free',
      totalSlots: 3,
      remainingSlots: 0,
      canPost: false,
    });
  });
});

describe('canUpgradeSubscription', () => {
  test.each([
    ['free', 'plus', true],
    ['free', 'premium', true],
    ['plus', 'premium', true],
    ['plus', 'plus', false],
    ['premium', 'plus', false],
    ['premium', 'premium', false],
  ])('%s -> %s trả về %s', (currentPlan, targetPlan, expected) => {
    expect(canUpgradeSubscription(currentPlan, targetPlan)).toBe(expected);
  });
});
