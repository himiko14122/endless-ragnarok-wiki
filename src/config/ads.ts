export type BannerType =
  | 'banner-468x60'
  | 'banner-300x250'
  | 'banner-160x300'
  | 'banner-160x600'
  | 'banner-320x50'
  | 'banner-728x90';

export type AdType = BannerType | 'native-banner';

export interface BannerSlot {
  type: BannerType;
  width: number;
  height: number;
  src: string;
}

export interface NativeSlot {
  type: 'native-banner';
  containerId: string;
  scriptUrl: string;
}

export type AdSlot = BannerSlot | NativeSlot;

const ADS_BASE_PATH = '/ads';

export const BANNER_SLOTS: Record<BannerType, BannerSlot> = {
  'banner-468x60': {
    type: 'banner-468x60',
    width: 468,
    height: 60,
    src: `${ADS_BASE_PATH}/banner-468x60.html`,
  },
  'banner-300x250': {
    type: 'banner-300x250',
    width: 300,
    height: 250,
    src: `${ADS_BASE_PATH}/banner-300x250.html`,
  },
  'banner-160x300': {
    type: 'banner-160x300',
    width: 160,
    height: 300,
    src: `${ADS_BASE_PATH}/banner-160x300.html`,
  },
  'banner-160x600': {
    type: 'banner-160x600',
    width: 160,
    height: 600,
    src: `${ADS_BASE_PATH}/banner-160x600.html`,
  },
  'banner-320x50': {
    type: 'banner-320x50',
    width: 320,
    height: 50,
    src: `${ADS_BASE_PATH}/banner-320x50.html`,
  },
  'banner-728x90': {
    type: 'banner-728x90',
    width: 728,
    height: 90,
    src: `${ADS_BASE_PATH}/banner-728x90.html`,
  },
};

export const NATIVE_SLOT: NativeSlot = {
  type: 'native-banner',
  containerId: 'container-785fed9330f1b43f5884ee2cef5fdc2b',
  scriptUrl: '//pl30269145.effectivecpmnetwork.com/785fed9330f1b43f5884ee2cef5fdc2b/invoke.js',
};

export const AD_SLOTS: Record<BannerType, BannerSlot> & { 'native-banner': NativeSlot } = {
  ...BANNER_SLOTS,
  'native-banner': NATIVE_SLOT,
};
