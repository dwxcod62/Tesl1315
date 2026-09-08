/**
 * Content blocks for the two side panels: REASONS and BENEFITS.
 *
 * Chỉ cần sửa file này là nội dung trong game sẽ thay đổi theo.
 * Thêm / bớt / sửa item đều được, không cần đụng vào App.jsx.
 *
 * Mỗi item cần:
 *   - title:   tiêu đề ngắn (string)
 *   - body:    mô tả (string)
 *   - icon:    tên một trong các icon bên dưới, hoặc null nếu không muốn icon
 *
 * Icon có sẵn:
 *   globe, handshake, trophy, heart, bolt, ball, volleyball, net, star, spark
 */

import {
  PixelGlobe,
  PixelHandshake,
  PixelTrophy,
  PixelHeart,
  PixelBolt,
  PixelBall,
  PixelVolleyball,
  PixelNet,
  PixelStar,
  PixelSpark,
} from '../components/PixelIcons';

// Icon lookup — chỉ cần gõ tên bằng string là component render đúng icon.
export const ICONS = {
  globe:      PixelGlobe,
  handshake:  PixelHandshake,
  trophy:     PixelTrophy,
  heart:      PixelHeart,
  bolt:       PixelBolt,
  ball:       PixelBall,
  volleyball: PixelVolleyball,
  net:        PixelNet,
  star:       PixelStar,
  spark:      PixelSpark,
};

// === REASONS — panel bên trái ============================================
export const REASONS = [
  {
    title: 'Different Cultures',
    body: 'Connect people from different cultural backgrounds through their shared love of volleyball.',
    icon: 'globe',
  },
  {
    title: 'Teamwork',
    body: 'Playing on the same team helps people communicate, cooperate, and build trust.',
    icon: 'handshake',
  },
  {
    title: 'Competition',
    body: 'Friendly competition brings people together and gives the community a shared goal.',
    icon: 'trophy',
  },
];

// === BENEFITS — panel bên phải ===========================================
export const BENEFITS = [
  {
    title: 'New Friendships',
    body: 'Meet new people and create lasting friendships with people from different backgrounds.',
    icon: 'heart',
  },
  {
    title: 'Stronger Community',
    body: 'Build teamwork, connection, and a sense of belonging.',
    icon: 'bolt',
  },
  {
    title: 'Cultural Understanding',
    body: 'People can learn about different cultures by meeting and playing with others',
    icon: 'ball',
  },
];
