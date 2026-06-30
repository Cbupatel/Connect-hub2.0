/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Coach, Player, TrainingPlan } from './types';

export const HERO_BG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuComRmC_6EvPB5gBzW4GAHMnsLIMW6zImpo-5MuDXNdvVSPN2Okq8yknuxWbkgRZ3Ft5xLuiw7PGr3_Ck5W8e4BLsdUGjR_TZ3cI4aBDABeVlZmB7YxxsMD6X-mAQLub794Tgru-DccgTOu7Ki3bZmjfFZQHTyRmRBFYmEsPBmibZW23pkMPQAfFHwRulyC32Mv-ctqaEdx8XztAKOB4ZjHfsfK7wYkStntrTcFkWG2SNifRdXeMhzcg8cEV3vOJq-lOku-ckWby3eo';

export const MISSION_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUz26bCLs7EDEdbtipgzNKRlr9PIunFQxRkX_i7iBnYfxthIkBurk00dJa0upr9F12bgq-7lV5d52QvHeMr2nF5WX0qCiEUvEvO-4yKO_mkR03tEtCPK5KzmT0N4RAVKM1lswQP-AtxgPcOblgF_ZHlPcQvZfDAgGOejd4JcEFQny_U2mChaVYkbPgANZYiP5eZ5hm5ZZRaXVCmZYeAPatA6Z6k9HLiDIhEz4UY4hAUpod5ZevPEeH2yhMgmyOgNHSXaCpikDqPTog';

export const FOUNDER_IMG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwXF9gyz2-sNKlOT6WLWuZmhHaqFruNAqwiunFRjecTd2Fbn2-fBLNMr6eq2PTj49i_Wkt34dRa5-mazf94qETSG2pL4eko9DEHKd2bqgMR9fw8AvOP1kQ4hfGiPGrtQg3T4RE2nUegjUpKnzbL2gtVFiuCfL2jTOvCp9wvn0zeIfCf_8eMztTtOHXP7dyQAckhFf2zbPa1PifwUPwrLW89K--tOvH0EQG0n1y5rhH6mI8IY-eqqzwD_y90DQ3UPOl5rFE2HmQ_kEE';

export const INITIAL_COACHES: Coach[] = [
  {
    id: 'c1',
    name: 'Rahul Sharma',
    specialty: 'Elite Scout',
    rating: 4.9,
    ratingCount: 142,
    bio: 'Former ISL Youth Coach. Specialist in Midfield Transition & Tactical Scouting. Focuses on spatial awareness and playmaking under pressure.',
    experience: '12+ Years',
    growthRate: 85,
    growthLabel: 'Player Growth Rate',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCb93aeV1uqDSfogAmCWTfYmakGpzrgD7xX-WLRO5tG2RLWKUM1r6iiu4YaoDQUq-VMMJYHm0tsxAZlf5JomZ5cFXCVAuzxb_7xnS_NBnjUP4Ge8UxjEkmdyMbYdQuhrhzria7ukEAWgW7Fylifm9fPYlsRdXLkmHPVDOxUD__Ny-Jux4fb1TibmvO9WbfVUwFPdic7V-EeO_wruRQIIronaeVMUhg2wX3w1N5wVJdtXOng_ny3x7VTcDhKjQpcYWjKrRQcom4NdqMm',
    location: 'Mumbai, Maharashtra',
    license: 'A-License Elite Coach',
    fees: '₹1,500/Month'
  },
  {
    id: 'c2',
    name: 'Anjali Mehta',
    specialty: 'Goalkeeping',
    rating: 5.0,
    ratingCount: 96,
    bio: 'UEFA \'B\' License holder. Focusing on advanced footwork, shot-stopping reflexes, high cross claims, and mental resilience under modern goalkeeping constraints.',
    experience: '8+ Years',
    growthRate: 92,
    growthLabel: 'Reflex Speed Dev',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcuKr_BoQcnUO4JbTNx8NT6DzKWqPGf9DftwgTvOeGtJKSFeadMzdAUZiMl8lKLdiz9dn4PooIVi_kwHwsZlX9bPJnxKOTnwRclv55sGS00mp73Cq5GRGAkQEAgCieOReaQkYoOzPT7i-n4DTWdFl2BlUYGDRuA4KeqaoJMKJJ5tof69s40mBpFjZNzGsqIYKBFzzndYg5ibbOndwYwmjkZMrWfBDvufbjlzQQrSdC_GyUpLq3PtQBaXKvUQD_0j9UzW4fOY46zDxX',
    location: 'Bengaluru, Karnataka',
    license: 'UEFA \'B\' Goalkeeping',
    fees: '₹1,800/Month'
  },
  {
    id: 'c3',
    name: 'Vikram Singh',
    specialty: 'Strength & Cond.',
    rating: 4.8,
    ratingCount: 110,
    bio: 'Specialist in high-intensity functional football-specific conditioning, explosive speed development, recovery optimization, and sports injury prevention protocols.',
    experience: '10+ Years',
    growthRate: 78,
    growthLabel: 'Stamina Score',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB__EDlo2MW44zYjeHST7th5r_iKvvCcvIh2aaWaASbipr-naYXFPblxmedRulgWTZy3aWjJUdvG9X1Qjx_C1x9xuDXvGBU22yemKcUVYoUT2iVgNGZTB-8XGMnjBlw8AIR_Ar4KLeNfgGMdyHwYvOhDoUp7PzDqABqYDWvpm12yTnCoxJoWTPjI3w12-5jpf2EcpC_7zFoAcqAbxAuqJpRIyfDhsL79_N869eSX74v80uvqDxQB8sTxae3KeI19RgYj69rjdfuia8u',
    location: 'Chandigarh, Punjab',
    license: 'FIFA S&C Cert.',
    fees: '₹1,200/Month'
  },
  {
    id: 'c4',
    name: 'Sanjay Roy',
    specialty: 'Tactical Expert',
    rating: 4.9,
    ratingCount: 124,
    bio: 'Master of Positional Play (Juego de Posición) and pressing systems. Expert in developing tactical IQ, decision making, and team shape under transition.',
    experience: '15+ Years',
    growthRate: 89,
    growthLabel: 'Tactical IQ Growth',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0J4QJ9C4sbUj7pEyMASfjsuDwGB79Viqq_vA2FzlIYQwu4yoPlIFiCgm5jSYSeAqzTie9S5g72ACwmXjtmBQh7xq0sm3nEQgziGFHT4S-OjLhmbl66-8zxsMjMe21JKdnq3f1OjxB1YZS4I6dSdcnpLAUE6abVoVOcUGcJzVraHLzSbOVYzyTbrCrvRp5YfB0odhiXd3vFSCVthyppKmRs9EzgPS4v7JEffj_FgN3h0tZHqbm5Us_sX2r05Gpxs8FTkEi6XRHbf6O',
    location: 'Kolkata, West Bengal',
    license: 'AFC \'A\' Diploma',
    fees: '₹2,000/Month'
  }
];

export const INITIAL_PLAYERS: Player[] = [
  {
    id: 'p1',
    name: 'Aaryan Khan',
    position: 'ST',
    age: 16,
    location: 'Imphal, Manipur',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    bio: 'High-speed center forward with sharp finishing instincts. Dominated Manipur State Inter-School League with 18 goals in 10 matches.',
    stats: {
      pace: 88,
      dribbling: 82,
      passing: 74,
      physicality: 76,
      tacticalIq: 80
    },
    achievements: ['Imphal League Golden Boot 2025', 'State U17 Captain']
  },
  {
    id: 'p2',
    name: 'Pranav Nair',
    position: 'CM',
    age: 17,
    location: 'Ernakulam, Kerala',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    bio: 'Deep-lying playmaker with incredible passing range and high tactical maturity. Expert in breaking low defensive blocks.',
    stats: {
      pace: 76,
      dribbling: 85,
      passing: 91,
      physicality: 70,
      tacticalIq: 94
    },
    achievements: ['Best Midfielder Kerala Youth Cup', 'ISL Scouted Trialist']
  },
  {
    id: 'p3',
    name: 'Denil Sahu',
    position: 'CB',
    age: 18,
    location: 'Ranchi, Jharkhand',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    bio: 'Explosive physical defender, exceptional aerial presence and leadership on the pitch. Expert in block organization.',
    stats: {
      pace: 78,
      dribbling: 68,
      passing: 72,
      physicality: 92,
      tacticalIq: 84
    },
    achievements: ['Jharkhand Inter-District Champ 2025', '92% Aerial Duels Won']
  },
  {
    id: 'p4',
    name: 'Suhail Ahmed',
    position: 'GK',
    age: 17,
    location: 'Srinagar, Jammu & Kashmir',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    bio: 'Commanding sweeper-keeper. Extremely agile with excellent footwork and penalty area control.',
    stats: {
      pace: 74,
      dribbling: 65,
      passing: 80,
      physicality: 78,
      tacticalIq: 87
    },
    achievements: ['Srinagar Youth Shield Clean Sheet MVP', 'National School Games GK Medalist']
  }
];

export const TRAINING_PLANS: TrainingPlan[] = [
  {
    id: 't1',
    title: '6-Week Elite Midfield Transition',
    category: 'Tactical & Passing',
    difficulty: 'Elite',
    duration: '45 mins / Day',
    description: 'A professional training regime designed by Rahul Sharma to help young midfielders master scanning, body orientation on reception, and quick spatial transitions.',
    drills: [
      {
        title: '360° Scanning & Half-Turn Receiving',
        duration: '15 Mins',
        instructions: [
          'Setup a 10x10 yard grid with 4 color cones in corners.',
          'Player stands in the center and receives passes from 2 bounce players on outfields.',
          'Before receiving, player must glance over shoulder and call colored cone indicated by whistle.',
          'Open hips on half-turn to pass in direction of active transition.'
        ]
      },
      {
        title: 'Line-Breaking Progressive Passes',
        duration: '15 Mins',
        instructions: [
          '3-zone layout: defender in center zone, striker in final third.',
          'Midfielder must bypass center defender using vertical ground passes (no lofted balls).',
          'Practice dummy movements and shadow runs to pull defensive shape.'
        ]
      },
      {
        title: 'High-Tempo Rondo (4v2 / 5v2)',
        duration: '15 Mins',
        instructions: [
          'Keep possession in tight grid with max 2-touch constraint.',
          'On transition of defenders, instantly trigger counter-pressing to win the ball back within 4 seconds.'
        ]
      }
    ]
  },
  {
    id: 't2',
    title: 'Modern Goalkeeping Reflex & Reflex Speed',
    category: 'Goalkeeping',
    difficulty: 'Intermediate',
    duration: '60 mins / Day',
    description: 'Hone swift reflexes, lateral drop-dives, and distribution techniques. Suitable for goalkeepers aims to build reliable penalty box dominance.',
    drills: [
      {
        title: 'Reaction Ball Save & Drop Dives',
        duration: '20 Mins',
        instructions: [
          'Use speed reaction ball to save short deflection shots from close ranges.',
          'Instantly recover to dynamic stance for secondary drop-dives in lower corners.'
        ]
      },
      {
        title: 'High-Cross Claim & Distribution Control',
        duration: '20 Mins',
        instructions: [
          'Coach fires high loop crosses towards back-post.',
          'Goalkeeper claims ball at apex of leap, calling loudly \'KEEPER!\'.',
          'Roll out or volley-pinpoint pass to side wings to start quick winger offense.'
        ]
      }
    ]
  },
  {
    id: 't3',
    title: 'Explosive Stamina & Match Agility',
    category: 'Strength & Conditioning',
    difficulty: 'Beginner',
    duration: '35 mins / Day',
    description: 'Ideal starting conditioning block to build explosive acceleration, fast change of direction (COD), and lungs fit for a full 90-minute pitch battle.',
    drills: [
      {
        title: 'T-Drill Shuttles (Sprint, Shuffle, Backpedal)',
        duration: '15 Mins',
        instructions: [
          'Cone setup in a T shape (5 yards apart).',
          'Sprint forward to center cone, lateral shuffle to left cone, lateral shuffle to far right, back to center, backpedal to start line.',
          'Rest for 45s between repetitions.'
        ]
      },
      {
        title: 'Match-Intensity HIIT Intervals',
        duration: '20 Mins',
        instructions: [
          'Run 90% sprint for 15 seconds, followed by 30 seconds jog, and 15 seconds walk.',
          'Repeat for 8 sets representing in-game explosive acceleration routines.'
        ]
      }
    ]
  }
];
