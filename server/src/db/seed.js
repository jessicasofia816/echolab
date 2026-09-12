import { db } from "./db.js";
export async function seedDatabase() {
    await seedCategories();
    await seedProducts();
    console.log("PostgreSQL database seeded");
}
async function seedCategories() {
    await db.query(`
    INSERT INTO categories (
      id,
      name,
      description,
      image
    )
    VALUES
      (
        'midi-keyboards',
        'MIDI Keyboards',
        'From pocket controllers to full 88-key weighted',
        '/images/categories/midi-keyboards.jpg'
      ),
      (
        'audio-interfaces',
        'Audio Interfaces',
        'Studio-grade conversion, zero-latency monitoring',
        '/images/categories/audio-interfaces.jpg'
      ),
      (
        'studio-monitors',
        'Studio Monitors',
        'Hear every detail with flat frequency response',
        '/images/categories/studio-monitors.jpg'
      ),
      (
        'headphones',
        'Studio Headphones',
        'Open & closed-back for mixing and tracking',
        '/images/categories/headphones.jpg'
      ),
      (
        'microphones',
        'Microphones',
        'Condenser, dynamic, and ribbon for every source',
        '/images/categories/microphones.jpg'
      ),
      (
        'synthesizers',
        'Synthesizers',
        'Analog warmth meets digital precision',
        '/images/categories/synthesizers.jpg'
      ),
      (
        'drum-machines',
        'Drum Machines',
        'Program, perform, and sculpt your rhythm',
        '/images/categories/drum-machines.jpg'
      ),
      (
        'dj-controllers',
        'DJ Controllers',
        'Built for the club, engineered for precision',
        '/images/categories/dj-controllers.jpg'
      ),
      (
        'mixers',
        'Mixers',
        'Analogue & digital mixers for studio and stage',
        '/images/categories/mixers.jpg'
      ),
      (
        'accessories',
        'Recording Accessories',
        'Cables, stands, pads, and everything in between',
        '/images/categories/accessories.jpg'
      )
    ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image = EXCLUDED.image;
    `);
}
async function seedProducts() {
    await db.query(`
    INSERT INTO products (
      id,
      name,
      tagline,
      category_id,
      price,
      original_price,
      image,
      images,
      badge,
      rating,
      review_count,
      in_stock,
      stock_count,
      featured,
      is_new,
      description,
      features,
      specs,
      tags,
      colors
    )
    VALUES
    (
      'pulse-49',
      'EchoLab Pulse 49',
      'Play without limits',
      'midi-keyboards',
      649,
      NULL,
      '/images/products/pulse-49/main.jpg',
      '["/images/products/pulse-49/2.jpg","/images/products/pulse-49/3.jpg"]',
      'Best Seller',
      4.8,
      342,
      1,
      24,
      1,
      0,
      'The Pulse 49 redefines what a MIDI controller can be. Forty-nine semi-weighted keys with channel aftertouch give you expressive, nuanced control over every parameter. Bluetooth MIDI and USB-C mean zero cables required. Designed and engineered in Stockholm.',
      '["49 semi-weighted keys with polyphonic aftertouch","Bluetooth MIDI 5.0 + USB-C connectivity","8 RGB velocity-sensitive performance pads","4 endless encoders + 4 touch-sensitive faders","Integrated arpeggiator and chord mode","Rechargeable — up to 10 hours wireless","Class-compliant, works with any DAW","Matte aluminium chassis, 2.4 kg"]',
      '[{"label":"Keys","value":"49 semi-weighted, polyphonic aftertouch"},{"label":"Connectivity","value":"USB-C, Bluetooth MIDI 5.0"},{"label":"Pads","value":"8 × RGB, velocity-sensitive"},{"label":"Controls","value":"4 encoders, 4 faders, transport"},{"label":"Battery","value":"3200 mAh Li-ion, ~10 hrs"},{"label":"Dimensions","value":"764 × 180 × 52 mm"},{"label":"Weight","value":"2.4 kg"},{"label":"Finish","value":"Matte anodised aluminium"}]',
      '["midi","keyboard","wireless","producer","bestseller"]',
      '["#111111","#E8E8E8"]'
    ),

    (
      'studio-one',
      'EchoLab Studio One',
      'Your studio, perfected',
      'audio-interfaces',
      449,
      NULL,
      '/images/products/studio-one/main.jpg',
      '["/images/products/studio-one/2.jpg"]',
      'New',
      4.9,
      128,
      1,
      41,
      1,
      1,
      'Two inputs, two outputs, and a preamp that rivals outboard gear worth ten times the price. The Studio One is the core of your setup — the interface that disappears into your workflow so you can focus on the music.',
      '["2 × Neutrik combo inputs (XLR/TRS)","192kHz/32-bit AD/DA conversion","EchoLab HALO preamp technology — lowest noise floor in class","Zero-latency direct monitoring with spatial blend","Dedicated headphone output, 120 mW","MIDI in/out, word clock I/O","USB-C bus powered","Machined aluminium body"]',
      '[{"label":"Inputs","value":"2 × Combo XLR/TRS (mic/line/hi-Z)"},{"label":"Outputs","value":"2 × TRS line, 1 × headphone"},{"label":"Sample rate","value":"Up to 192 kHz"},{"label":"Bit depth","value":"32-bit float"},{"label":"Dynamic range","value":"120 dB"},{"label":"Latency","value":"< 1 ms (direct monitoring)"},{"label":"Power","value":"USB-C bus powered"},{"label":"Dimensions","value":"185 × 47 × 100 mm"}]',
      '["interface","recording","usb","preamp"]',
      '["#111111"]'
    ),

    (
      'wave-x',
      'EchoLab Wave X',
      'Hear everything, miss nothing',
      'studio-monitors',
      899,
      NULL,
      '/images/products/wave-x/main.jpg',
      '["/images/products/wave-x/2.jpg"]',
      'Staff Pick',
      4.7,
      89,
      1,
      12,
      0,
      0,
      'A 5-inch active studio monitor built around a class-D amplifier and EchoLab''s proprietary waveguide horn. Flat response from 45 Hz to 24 kHz. Available individually or as a stereo pair.',
      '["5″ woven-composite woofer, 1″ tweeter","80W class-D bi-amplification","Flat response 45 Hz – 24 kHz (±1.5 dB)","Room correction DSP with 4-band parametric EQ","XLR, TRS, and RCA inputs","Auto-standby after 20 min silence","Magnetically shielded drivers","Price per unit; stereo pair €1,599"]',
      '[{"label":"Woofer","value":"5″ woven composite"},{"label":"Tweeter","value":"1″ soft dome"},{"label":"Amplification","value":"80W class-D bi-amp"},{"label":"Frequency response","value":"45 Hz – 24 kHz (±1.5 dB)"},{"label":"Max SPL","value":"108 dB peak"},{"label":"Inputs","value":"XLR, TRS, RCA"},{"label":"Dimensions","value":"185 × 175 × 255 mm"},{"label":"Weight","value":"5.8 kg"}]',
      '["monitor","studio","mixing","mastering"]',
      NULL
    ),

    (
      'nova-interface',
      'EchoLab Nova Interface',
      'Pristine conversion for the discerning ear',
      'audio-interfaces',
      299,
      NULL,
      '/images/products/nova-interface/main.jpg',
      '[]',
      NULL,
      4.6,
      203,
      1,
      67,
      0,
      0,
      'The entry point to the EchoLab ecosystem. One mic preamp, one instrument input, and a headphone output that shames interfaces twice the price. Small on your desk. Enormous in your recordings.',
      '["1 × XLR mic preamp + 1 × instrument input","96 kHz / 24-bit conversion","HALO preamp technology","48V phantom power","Dedicated headphone out with level control","USB-C bus powered, plug and play"]',
      '[{"label":"Inputs","value":"1 × XLR, 1 × TS (hi-Z)"},{"label":"Outputs","value":"2 × TRS, 1 × headphone"},{"label":"Sample rate","value":"Up to 96 kHz"},{"label":"Bit depth","value":"24-bit"},{"label":"Phantom power","value":"48V switchable"},{"label":"Dimensions","value":"120 × 40 × 80 mm"}]',
      '["interface","recording","usb","beginner"]',
      NULL
    ),

    (
      'bass-monitor',
      'EchoLab Bass Monitor',
      'Low end authority',
      'studio-monitors',
      1299,
      NULL,
      '/images/products/bass-monitor/main.jpg',
      '["/images/products/bass-monitor/2.jpg"]',
      'Limited',
      4.9,
      34,
      1,
      5,
      1,
      0,
      'An 8-inch three-way nearfield monitor built for producers who cannot afford to get the low end wrong. The Bass Monitor extends down to 35 Hz with surgical accuracy, powered by 200W of class-D amplification.',
      '["8″ mineral-fibre woofer, 4″ midrange, 1″ tweeter","200W class-D tri-amplification","Response: 35 Hz – 22 kHz (±2 dB)","Onboard DSP, 8-band parametric EQ","AES/EBU, XLR, TRS inputs","LAN control via EchoLab Control app"]',
      '[{"label":"Woofer","value":"8″ mineral-fibre"},{"label":"Amplification","value":"200W class-D tri-amp"},{"label":"Frequency response","value":"35 Hz – 22 kHz (±2 dB)"},{"label":"Max SPL","value":"116 dB peak"},{"label":"Inputs","value":"AES/EBU, XLR, TRS"},{"label":"Dimensions","value":"245 × 255 × 375 mm"},{"label":"Weight","value":"11.4 kg"}]',
      '["monitor","studio","bass","mastering","limited"]',
      '["#111111","#1a1a1a"]'
    ),

    (
      'air-headphones',
      'EchoLab Air Headphones',
      'Open-back clarity, all day comfort',
      'headphones',
      349,
      429,
      '/images/products/air-headphones/main.jpg',
      '[]',
      'Sale',
      4.7,
      512,
      1,
      88,
      1,
      0,
      'Open-back studio reference headphones built for long sessions. The Air features 45mm planar-driver technology, a featherweight aluminium chassis, and velour ear cups that breathe as well as they sound.',
      '["45mm planar magnetic drivers","Open-back acoustic design for natural soundstage","Frequency response: 10 Hz – 40 kHz","Impedance: 150 Ω — perfect for interfaces","Detachable 3m OFC cable + 1.2m balanced cable","Aluminium headband, velour ear cups","Weight: 285g"]',
      '[{"label":"Driver","value":"45mm planar magnetic"},{"label":"Design","value":"Open-back circumaural"},{"label":"Frequency response","value":"10 Hz – 40 kHz"},{"label":"Impedance","value":"150 Ω"},{"label":"Sensitivity","value":"97 dB/mW"},{"label":"Cable","value":"3m OFC + 1.2m balanced (detachable)"},{"label":"Weight","value":"285 g (without cable)"}]',
      '["headphones","open-back","mixing","reference"]',
      '["#111111","#8B0000"]'
    ),

    (
      'beat-machine',
      'EchoLab Beat Machine',
      'Rhythm, sculpted',
      'drum-machines',
      799,
      NULL,
      '/images/products/beat-machine/main.jpg',
      '["/images/products/beat-machine/2.jpg"]',
      'New',
      4.8,
      67,
      1,
      19,
      1,
      1,
      'A 16-track sequencer and drum synthesiser in one compact unit. Each track has its own discrete voice with analogue-modelled envelopes, punch, and tone. Step-edit, real-time record, and an onboard effects chain round out a machine built to move crowds.',
      '["16 × discrete synthesised drum voices","64-step per-track sequencer","Per-step probability, swing, and velocity","Analogue-modelled envelopes and filters","4 stereo insert FX (distortion, reverb, delay, comp)","Sample import via SD card","MIDI/CV/DIN sync","Standalone or USB audio/MIDI to DAW"]',
      '[{"label":"Voices","value":"16 synthesised + 4 sampled"},{"label":"Sequencer","value":"64 steps per track, polyrhythm"},{"label":"Outputs","value":"4 × stereo TRS, master stereo XLR"},{"label":"Sync","value":"MIDI, DIN, USB, CV clock"},{"label":"Storage","value":"SD card (sample import)"},{"label":"Dimensions","value":"320 × 195 × 54 mm"},{"label":"Weight","value":"1.9 kg"}]',
      '["drum machine","sequencer","electronic","beats"]',
      NULL
    ),

    (
      'flow-mixer',
      'EchoLab Flow Mixer',
      'Every signal, under control',
      'mixers',
      549,
      NULL,
      '/images/products/flow-mixer/main.jpg',
      '["/images/products/flow-mixer/2.jpg"]',
      NULL,
      4.5,
      156,
      1,
      34,
      0,
      0,
      'A 12-channel DJ mixer with analogue signal path, 24-bit digital effects, and full USB audio integration. The Flow Mixer bridges the worlds of live performance and studio recording without compromise.',
      '["12 channels: 4 × stereo line, 4 × phono, 2 × mic, 2 × USB","3-band EQ with kill switches per channel","Dual USB audio interfaces (48kHz/24-bit)","24-bit digital FX: reverb, echo, flanger, filter","Send/return effects loop","Booth and master outputs (XLR + TRS)","Headphone cueing with EQ and level"]',
      '[{"label":"Channels","value":"12 (4 line, 4 phono, 2 mic, 2 USB)"},{"label":"EQ","value":"3-band with kill per channel"},{"label":"USB audio","value":"48 kHz / 24-bit (×2 ports)"},{"label":"Effects","value":"24-bit DSP, 16 effects types"},{"label":"Outputs","value":"Master XLR + TRS, booth TRS, rec RCA"},{"label":"Dimensions","value":"320 × 62 × 260 mm"}]',
      '["mixer","dj","analogue","live"]',
      NULL
    ),

    (
      'sync-pro',
      'EchoLab Sync Pro',
      'Built for the mainstage',
      'dj-controllers',
      1199,
      NULL,
      '/images/products/sync-pro/main.jpg',
      '["/images/products/sync-pro/2.jpg"]',
      'Best Seller',
      4.9,
      278,
      1,
      8,
      1,
      0,
      'A professional 4-deck DJ controller with motorised jog wheels and a full-size mixer section. Built from aircraft-grade aluminium and engineered to survive the road. Works natively with Serato DJ Pro and Traktor Pro.',
      '["4-deck control with motorised 8″ jog wheels","Full analogue 4-channel mixer section","16 performance pads per deck (cue, loop, slicer, sampler)","Built-in 2-port USB hub","Hardware FX paddles (filter, reverb, echo)","Compatible with Serato DJ Pro + Traktor Pro 3","Aircraft-grade aluminium chassis"]',
      '[{"label":"Decks","value":"4 (2 per side)"},{"label":"Jog wheels","value":"8″ motorised (×2)"},{"label":"Pads","value":"16 per deck × 4 decks"},{"label":"Channels","value":"4 + master + booth"},{"label":"Software","value":"Serato DJ Pro, Traktor Pro 3"},{"label":"Dimensions","value":"650 × 380 × 75 mm"},{"label":"Weight","value":"7.2 kg"}]',
      '["dj controller","motorised","serato","traktor","professional"]',
      NULL
    ),

    (
      'keys-88',
      'EchoLab Keys 88',
      'The full 88',
      'midi-keyboards',
      1099,
      NULL,
      '/images/products/keys-88/main.jpg',
      '["/images/products/keys-88/2.jpg"]',
      'New',
      4.8,
      41,
      1,
      14,
      1,
      1,
      'Full 88-key hammer-action keyboard for composers and performers who demand the feel of a concert grand. Triple sensors on each key capture every nuance of velocity and articulation.',
      '["88 graduated hammer-weighted keys","Triple sensor per key for accurate repeated-note detection","Polyphonic aftertouch on upper octaves","Escapement mechanism simulation","USB-C + 5-pin MIDI DIN","3-pedal unit included","Quarter-sawn walnut cabinet option"]',
      '[{"label":"Keys","value":"88 graduated hammer-weighted"},{"label":"Sensor","value":"Triple per key"},{"label":"Aftertouch","value":"Polyphonic (upper 2 octaves)"},{"label":"Connectivity","value":"USB-C, MIDI DIN 5-pin"},{"label":"Pedal","value":"3-pedal sustain unit included"},{"label":"Dimensions","value":"1380 × 145 × 95 mm"},{"label":"Weight","value":"18.5 kg"}]',
      '["midi","keyboard","88-key","weighted","composer"]',
      NULL
    ),

    (
      'capsule-xlr',
      'EchoLab Capsule XLR',
      'Capture the truth',
      'microphones',
      249,
      NULL,
      '/images/products/capsule-xlr/main.jpg',
      '[]',
      NULL,
      4.6,
      189,
      1,
      55,
      0,
      0,
      'A large-diaphragm condenser microphone with a hand-selected cardioid capsule. Detailed, transparent, and utterly ruthless at capturing every nuance of voice, acoustic guitar, or room ambience.',
      '["34mm large-diaphragm cardioid capsule","Frequency response: 20 Hz – 20 kHz","Self-noise: < 7 dBA","10 dB and 20 dB pad switches","High-pass filter at 80 Hz and 160 Hz","Requires 48V phantom power","Shock mount and hard case included"]',
      '[{"label":"Capsule","value":"34mm large-diaphragm cardioid"},{"label":"Self-noise","value":"< 7 dBA"},{"label":"Max SPL","value":"135 dB (with pad)"},{"label":"Frequency response","value":"20 Hz – 20 kHz"},{"label":"Impedance","value":"< 200 Ω"},{"label":"Phantom power","value":"48V required"},{"label":"Weight","value":"445 g"}]',
      '["microphone","condenser","vocal","recording"]',
      NULL
    ),

    (
      'void-synth',
      'EchoLab Void',
      'Analogue depth, digital recall',
      'synthesizers',
      2499,
      NULL,
      '/images/products/void-synth/main.jpg',
      '["/images/products/void-synth/2.jpg"]',
      'Limited',
      4.9,
      23,
      1,
      3,
      1,
      1,
      'EchoLab''s first fully analogue synthesiser. Three DCOs, two ladder filters, a 64-step sequencer, and a full-patch matrix — and every parameter is digitally recalled across 1024 presets. Limited to 500 units.',
      '["3 × DCO with hard sync, FM, and cross-modulation","2 × CEM3340-based 24dB ladder filters (series or parallel)","4 × AD/ADSR envelopes, 4 × LFOs","64-step polyphonic sequencer","1024 preset recall with analogue circuit","Extensive modulation matrix: 16 × 16 patch points","Stereo FX: reverb, chorus, distortion","CV/Gate + MIDI DIN + USB","Matte black walnut-panel cabinet — limited edition"]',
      '[{"label":"Architecture","value":"3 DCO, 2 VCF, 4 VCA"},{"label":"Filters","value":"2 × 24dB ladder (CEM3340)"},{"label":"Polyphony","value":"Monophonic + 2-voice paraphonic"},{"label":"Sequencer","value":"64-step polyphonic"},{"label":"Presets","value":"1024 total (512 factory + 512 user)"},{"label":"CV/Gate","value":"4 × CV in, 2 × gate in, 2 × CV out"},{"label":"Dimensions","value":"540 × 95 × 310 mm"},{"label":"Weight","value":"6.8 kg"}]',
      '["synthesizer","analogue","limited","modular"]',
      '["#111111"]'
    )

    ON CONFLICT (id) DO NOTHING;
  `);
}
//# sourceMappingURL=seed.js.map