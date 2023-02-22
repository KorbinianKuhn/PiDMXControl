import { ChannelType, Device } from '../interfaces/general.interfaces';

const GIGABAR_HEX_CHANNELS: ChannelType[] = [
  ChannelType.RED,
  ChannelType.GREEN,
  ChannelType.BLUE,
  ChannelType.WHITE,
  ChannelType.AMBER,
  ChannelType.UV,
  ChannelType.MASTER,
  ChannelType.STROBE,
  ChannelType.OTHER, // sound mode]
];

const EUROLITE_BAR_SEGMENT_CHANNEL_ORDER: ChannelType[] = [
  ChannelType.MASTER,
  ChannelType.STROBE,
  ChannelType.RED,
  ChannelType.GREEN,
  ChannelType.BLUE,
  ChannelType.OTHER,
];

const EUROLITE_BAR_CHANNELS = new Array(6 * 8)
  .fill(null)
  .map((o, i) => EUROLITE_BAR_SEGMENT_CHANNEL_ORDER[i % 6]);

const DIAMOND_DOME_CHANNELS: ChannelType[] = [
  ChannelType.RED,
  ChannelType.GREEN,
  ChannelType.BLUE,
  ChannelType.WHITE,
  ChannelType.AMBER,
  ChannelType.UV,
  ChannelType.STROBE,
  ChannelType.MOVEMENT,
  ChannelType.OTHER, // sound mode
];

const SABER_SPOT_CHANNELS: ChannelType[] = [
  ChannelType.STROBE,
  ChannelType.RED,
  ChannelType.GREEN,
  ChannelType.BLUE,
  ChannelType.WHITE,
  ChannelType.MASTER,
];

const HERO_WASH_CHANNELS: ChannelType[] = [
  ChannelType.OTHER, //pan
  ChannelType.OTHER, // pan fine
  ChannelType.OTHER, // tilt
  ChannelType.OTHER, // tilt fine
  ChannelType.OTHER, // speed pan tilt
  ChannelType.MASTER,
  ChannelType.STROBE, // 10-250
  ChannelType.RED,
  ChannelType.GREEN,
  ChannelType.BLUE,
  ChannelType.WHITE,
  ChannelType.AMBER,
  ChannelType.UV,
  ChannelType.OTHER, // color temperature
  ChannelType.OTHER, // color macros
  ChannelType.OTHER, // auto programs
];

export const DEVICES: Device[] = [
  {
    name: 'Varytec Gigabar Hex (1)',
    address: 1,
    channels: GIGABAR_HEX_CHANNELS,
  },
  {
    name: 'Varytec Gigabar Hex (2)',
    address: 10,
    channels: GIGABAR_HEX_CHANNELS,
  },
  {
    name: 'Varytec Gigabar Hex (3)',
    address: 20,
    channels: GIGABAR_HEX_CHANNELS,
  },
  {
    name: 'Varytec Gigabar Hex (4)',
    address: 30,
    channels: GIGABAR_HEX_CHANNELS,
  },
  {
    name: 'Varytec Gigabar Hex (5)',
    address: 40,
    channels: GIGABAR_HEX_CHANNELS,
  },
  {
    name: 'Eurolite LED Pix-144',
    address: 50,
    channels: EUROLITE_BAR_CHANNELS,
  },
  {
    name: 'FunGeneration Diamond Dome',
    address: 99,
    channels: DIAMOND_DOME_CHANNELS,
  },
  {
    name: 'ADJ Saber Spot',
    address: 108,
    channels: SABER_SPOT_CHANNELS,
  },
  {
    name: 'Varytec Hero Wash (1)',
    address: 114,
    channels: HERO_WASH_CHANNELS,
  },
  {
    name: 'Varytec Hero Wash (2)',
    address: 130,
    channels: HERO_WASH_CHANNELS,
  },
];
