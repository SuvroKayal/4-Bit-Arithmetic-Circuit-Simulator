/**
 * 4-Bit Arithmetic Circuit Simulator - Interactive Circuit Diagrams (SVG)
 * Generates technically accurate IEEE-standard logic diagrams with dynamic signal state illumination.
 */

const CircuitDiagrams = {
    // Generate Half Adder SVG
    renderHalfAdder(containerId, state = { a: 1, b: 0 }) {
        const a = state.a & 1;
        const b = state.b & 1;
        const sum = a ^ b;
        const carry = a & b;

        const valClass = (v) => (v ? "wire-high" : "wire-low");
        const valText = (v) => (v ? "1" : "0");

        const svg = `
        <svg viewBox="0 0 680 340" width="100%" class="circuit-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            <!-- Background Grid -->
            <g class="circuit-grid" opacity="0.15">
                ${Array.from({length: 17}, (_, i) => `<line x1="${i*40}" y1="0" x2="${i*40}" y2="340" stroke="#38BDF8" stroke-width="0.5"/>`).join('')}
                ${Array.from({length: 9}, (_, i) => `<line x1="0" y1="${i*40}" x2="680" y2="${i*40}" stroke="#38BDF8" stroke-width="0.5"/>`).join('')}
            </g>

            <!-- Title & Labels -->
            <text x="340" y="32" class="circuit-title-text" text-anchor="middle">1-BIT HALF ADDER (HA)</text>
            <text x="340" y="52" class="circuit-sub-text" text-anchor="middle">Sum = A ⊕ B  |  Carry = A · B</text>

            <!-- Input A Line -->
            <path d="M 80,100 L 220,100" class="wire ${valClass(a)}" id="ha-wire-a"/>
            <!-- Branch A down to AND gate -->
            <path d="M 160,100 L 160,220 L 220,220" class="wire ${valClass(a)}" id="ha-wire-a-branch"/>
            <circle cx="160" cy="100" r="4.5" class="junction-dot ${valClass(a)}"/>

            <!-- Input B Line -->
            <path d="M 80,140 L 220,140" class="wire ${valClass(b)}" id="ha-wire-b"/>
            <!-- Branch B down to AND gate -->
            <path d="M 130,140 L 130,260 L 220,260" class="wire ${valClass(b)}" id="ha-wire-b-branch"/>
            <circle cx="130" cy="140" r="4.5" class="junction-dot ${valClass(b)}"/>

            <!-- Input Terminals & Interactive Badges -->
            <g class="circuit-pin interactive-pin" onclick="App.toggleHalfAdderBit('a')">
                <rect x="25" y="82" width="55" height="36" rx="6" class="pin-box"/>
                <text x="52" y="105" class="pin-label">A = <tspan class="pin-val ${valClass(a)}">${valText(a)}</tspan></text>
            </g>

            <g class="circuit-pin interactive-pin" onclick="App.toggleHalfAdderBit('b')">
                <rect x="25" y="122" width="55" height="36" rx="6" class="pin-box"/>
                <text x="52" y="145" class="pin-label">B = <tspan class="pin-val ${valClass(b)}">${valText(b)}</tspan></text>
            </g>

            <!-- XOR Gate (Sum = A XOR B) -->
            <g class="gate-group" transform="translate(220, 80)">
                <!-- XOR input arc -->
                <path d="M 0,20 Q 20,40 0,60" fill="none" class="gate-body-outline" stroke-width="2.5"/>
                <!-- XOR main body -->
                <path d="M 12,20 Q 32,40 12,60 Q 55,58 90,40 Q 55,22 12,20 Z" class="gate-body"/>
                <text x="40" y="44" class="gate-label">XOR</text>
            </g>
            <!-- XOR Output wire to Sum -->
            <path d="M 310,120 L 530,120" class="wire ${valClass(sum)}" id="ha-wire-sum"/>

            <!-- AND Gate (Carry = A AND B) -->
            <g class="gate-group" transform="translate(220, 200)">
                <!-- AND main body -->
                <path d="M 10,20 L 50,20 Q 90,20 90,40 Q 90,60 50,60 L 10,60 Z" class="gate-body"/>
                <text x="44" y="44" class="gate-label">AND</text>
            </g>
            <!-- AND Output wire to Carry -->
            <path d="M 310,240 L 530,240" class="wire ${valClass(carry)}" id="ha-wire-carry"/>

            <!-- Output Terminals -->
            <g class="circuit-pin">
                <rect x="530" y="102" width="120" height="36" rx="6" class="pin-box output-pin"/>
                <text x="590" y="125" class="pin-label">SUM = <tspan class="pin-val ${valClass(sum)}">${valText(sum)}</tspan></text>
            </g>

            <g class="circuit-pin">
                <rect x="530" y="222" width="120" height="36" rx="6" class="pin-box output-pin"/>
                <text x="590" y="245" class="pin-label">CARRY = <tspan class="pin-val ${valClass(carry)}">${valText(carry)}</tspan></text>
            </g>

            <!-- Annotations -->
            <text x="420" y="112" class="wire-annotation ${valClass(sum)}">S = A ⊕ B (${valText(sum)})</text>
            <text x="420" y="232" class="wire-annotation ${valClass(carry)}">C = A · B (${valText(carry)})</text>
        </svg>`;

        const container = document.getElementById(containerId);
        if (container) container.innerHTML = svg;
    },

    // Generate Full Adder SVG (composed of 2 Half Adders + OR gate)
    renderFullAdder(containerId, state = { a: 1, b: 1, cin: 0 }) {
        const a = state.a & 1;
        const b = state.b & 1;
        const cin = state.cin & 1;

        const res = CircuitSimulator.fullAdder(a, b, cin);
        const { a_xor_b, a_and_b, cin_and_prop } = res.intermediate;
        const sum = res.sum;
        const cout = res.cout;

        const valClass = (v) => (v ? "wire-high" : "wire-low");
        const valText = (v) => (v ? "1" : "0");

        const svg = `
        <svg viewBox="0 0 880 440" width="100%" class="circuit-svg" xmlns="http://www.w3.org/2000/svg">
            <!-- Background Grid -->
            <g class="circuit-grid" opacity="0.15">
                ${Array.from({length: 22}, (_, i) => `<line x1="${i*40}" y1="0" x2="${i*40}" y2="440" stroke="#38BDF8" stroke-width="0.5"/>`).join('')}
                ${Array.from({length: 11}, (_, i) => `<line x1="0" y1="${i*40}" x2="880" y2="${i*40}" stroke="#38BDF8" stroke-width="0.5"/>`).join('')}
            </g>

            <!-- Title & Labels -->
            <text x="440" y="28" class="circuit-title-text" text-anchor="middle">1-BIT FULL ADDER (2 HAs + OR GATE)</text>
            <text x="440" y="48" class="circuit-sub-text" text-anchor="middle">Sum = A ⊕ B ⊕ Cin  |  Cout = (A · B) + (Cin · (A ⊕ B))</text>

            <!-- Subcircuit Group 1: Half Adder 1 Box -->
            <rect x="180" y="65" width="220" height="235" rx="10" class="subcircuit-box" stroke-dasharray="6,4"/>
            <text x="290" y="85" class="subcircuit-title" text-anchor="middle">STAGE 1: HALF ADDER 1</text>

            <!-- Subcircuit Group 2: Half Adder 2 Box -->
            <rect x="440" y="65" width="220" height="235" rx="10" class="subcircuit-box" stroke-dasharray="6,4"/>
            <text x="550" y="85" class="subcircuit-title" text-anchor="middle">STAGE 2: HALF ADDER 2</text>

            <!-- Input A Line -->
            <path d="M 60,110 L 220,110" class="wire ${valClass(a)}"/>
            <path d="M 130,110 L 130,220 L 220,220" class="wire ${valClass(a)}"/>
            <circle cx="130" cy="110" r="4.5" class="junction-dot ${valClass(a)}"/>

            <!-- Input B Line -->
            <path d="M 60,150 L 220,150" class="wire ${valClass(b)}"/>
            <path d="M 110,150 L 110,260 L 220,260" class="wire ${valClass(b)}"/>
            <circle cx="110" cy="150" r="4.5" class="junction-dot ${valClass(b)}"/>

            <!-- Input Cin Line -->
            <path d="M 60,370 L 410,370 L 410,150 L 480,150" class="wire ${valClass(cin)}"/>
            <!-- Branch Cin to AND2 -->
            <path d="M 410,260 L 480,260" class="wire ${valClass(cin)}"/>
            <circle cx="410" cy="260" r="4.5" class="junction-dot ${valClass(cin)}"/>

            <!-- Input Pins -->
            <g class="circuit-pin interactive-pin" onclick="App.toggleFullAdderBit('a')">
                <rect x="15" y="92" width="55" height="36" rx="6" class="pin-box"/>
                <text x="42" y="115" class="pin-label">A = <tspan class="pin-val ${valClass(a)}">${valText(a)}</tspan></text>
            </g>

            <g class="circuit-pin interactive-pin" onclick="App.toggleFullAdderBit('b')">
                <rect x="15" y="132" width="55" height="36" rx="6" class="pin-box"/>
                <text x="42" y="155" class="pin-label">B = <tspan class="pin-val ${valClass(b)}">${valText(b)}</tspan></text>
            </g>

            <g class="circuit-pin interactive-pin" onclick="App.toggleFullAdderBit('cin')">
                <rect x="15" y="352" width="70" height="36" rx="6" class="pin-box"/>
                <text x="50" y="375" class="pin-label">Cin = <tspan class="pin-val ${valClass(cin)}">${valText(cin)}</tspan></text>
            </g>

            <!-- XOR 1 (HA1) -->
            <g class="gate-group" transform="translate(220, 90)">
                <path d="M 0,20 Q 20,40 0,60" fill="none" class="gate-body-outline" stroke-width="2.5"/>
                <path d="M 12,20 Q 32,40 12,60 Q 55,58 90,40 Q 55,22 12,20 Z" class="gate-body"/>
                <text x="40" y="44" class="gate-label">XOR 1</text>
            </g>

            <!-- AND 1 (HA1) -->
            <g class="gate-group" transform="translate(220, 200)">
                <path d="M 10,20 L 50,20 Q 90,20 90,40 Q 90,60 50,60 L 10,60 Z" class="gate-body"/>
                <text x="44" y="44" class="gate-label">AND 1</text>
            </g>

            <!-- Intermediate wire S1 = A XOR B to HA2 XOR2 and AND2 -->
            <path d="M 310,130 L 440,130 L 440,110 L 480,110" class="wire ${valClass(a_xor_b)}"/>
            <path d="M 440,130 L 440,220 L 480,220" class="wire ${valClass(a_xor_b)}"/>
            <circle cx="440" cy="130" r="4.5" class="junction-dot ${valClass(a_xor_b)}"/>
            <text x="360" y="122" class="wire-annotation ${valClass(a_xor_b)}">S1 = A ⊕ B (${valText(a_xor_b)})</text>

            <!-- Intermediate wire C1 = A AND B down to OR gate -->
            <path d="M 310,240 L 370,240 L 370,330 L 710,330" class="wire ${valClass(a_and_b)}"/>
            <text x="375" y="275" class="wire-annotation ${valClass(a_and_b)}">C1 = A · B (${valText(a_and_b)})</text>

            <!-- XOR 2 (HA2) -->
            <g class="gate-group" transform="translate(480, 90)">
                <path d="M 0,20 Q 20,40 0,60" fill="none" class="gate-body-outline" stroke-width="2.5"/>
                <path d="M 12,20 Q 32,40 12,60 Q 55,58 90,40 Q 55,22 12,20 Z" class="gate-body"/>
                <text x="40" y="44" class="gate-label">XOR 2</text>
            </g>

            <!-- AND 2 (HA2) -->
            <g class="gate-group" transform="translate(480, 200)">
                <path d="M 10,20 L 50,20 Q 90,20 90,40 Q 90,60 50,60 L 10,60 Z" class="gate-body"/>
                <text x="44" y="44" class="gate-label">AND 2</text>
            </g>

            <!-- Final SUM wire from XOR 2 -->
            <path d="M 570,130 L 730,130" class="wire ${valClass(sum)}"/>
            <g class="circuit-pin">
                <rect x="730" y="112" width="125" height="36" rx="6" class="pin-box output-pin"/>
                <text x="792" y="135" class="pin-label">SUM = <tspan class="pin-val ${valClass(sum)}">${valText(sum)}</tspan></text>
            </g>

            <!-- Intermediate wire C2 = Cin AND S1 to OR gate -->
            <path d="M 570,240 L 640,240 L 640,370 L 710,370" class="wire ${valClass(cin_and_prop)}"/>
            <text x="585" y="232" class="wire-annotation ${valClass(cin_and_prop)}">C2 = Cin · S1 (${valText(cin_and_prop)})</text>

            <!-- OR Gate (Combines C1 + C2) -->
            <g class="gate-group" transform="translate(710, 310)">
                <path d="M 0,20 Q 20,40 0,60 Q 45,58 75,40 Q 45,22 0,20 Z" class="gate-body"/>
                <text x="32" y="44" class="gate-label">OR</text>
            </g>

            <!-- Carry-Out Wire from OR Gate -->
            <path d="M 785,350 L 825,350 L 825,350" class="wire ${valClass(cout)}"/>
            <g class="circuit-pin">
                <rect x="730" y="390" width="125" height="36" rx="6" class="pin-box output-pin"/>
                <text x="792" y="413" class="pin-label">Cout = <tspan class="pin-val ${valClass(cout)}">${valText(cout)}</tspan></text>
            </g>
            <path d="M 785,350 L 792,350 L 792,390" class="wire ${valClass(cout)}"/>
        </svg>`;

        const container = document.getElementById(containerId);
        if (container) container.innerHTML = svg;
    },

    // Generate 4-Bit Ripple Carry Adder SVG
    render4BitAdder(containerId, state = { a: 5, b: 3, cin: 0 }) {
        const a = state.a & 15;
        const b = state.b & 15;
        const cin = state.cin & 1;

        const res = CircuitSimulator.fourBitAdder(a, b, cin);
        const stages = res.stages;
        const valClass = (v) => (v ? "wire-high" : "wire-low");
        const valText = (v) => (v ? "1" : "0");

        // 4 Full Adders arranged horizontally from FA3 (MSB) down to FA0 (LSB) or FA0 to FA3
        // In standard digital design: LSB (FA0) is on the right, MSB (FA3) on the left
        const stageX = [700, 500, 300, 100]; // FA0, FA1, FA2, FA3

        const svg = `
        <svg viewBox="0 0 960 480" width="100%" class="circuit-svg" xmlns="http://www.w3.org/2000/svg">
            <g class="circuit-grid" opacity="0.12">
                ${Array.from({length: 24}, (_, i) => `<line x1="${i*40}" y1="0" x2="${i*40}" y2="480" stroke="#38BDF8" stroke-width="0.5"/>`).join('')}
                ${Array.from({length: 12}, (_, i) => `<line x1="0" y1="${i*40}" x2="960" y2="${i*40}" stroke="#38BDF8" stroke-width="0.5"/>`).join('')}
            </g>

            <text x="480" y="32" class="circuit-title-text" text-anchor="middle">4-BIT RIPPLE CARRY ADDER (CASCADED FULL ADDERS)</text>
            <text x="480" y="52" class="circuit-sub-text" text-anchor="middle">Carry ripples from Stage 0 (LSB) through to Stage 3 (MSB)</text>

            <!-- Carry-In to FA0 -->
            <path d="M 890,240 L 800,240" class="wire ${valClass(cin)} ${cin ? 'wire-pulse' : ''}"/>
            <g class="circuit-pin interactive-pin" onclick="App.toggleRippleCin()">
                <rect x="850" y="222" width="65" height="36" rx="6" class="pin-box"/>
                <text x="882" y="245" class="pin-label">Cin = <tspan class="pin-val ${valClass(cin)}">${valText(cin)}</tspan></text>
            </g>

            <!-- Ripple Carry Lines between stages -->
            <!-- C1 from FA0 to FA1 -->
            <path d="M 700,240 L 600,240" class="wire ${valClass(stages[0].cout)} ${stages[0].cout ? 'wire-pulse' : ''}"/>
            <text x="650" y="230" class="wire-annotation ${valClass(stages[0].cout)}" text-anchor="middle">C1 = ${valText(stages[0].cout)}</text>

            <!-- C2 from FA1 to FA2 -->
            <path d="M 500,240 L 400,240" class="wire ${valClass(stages[1].cout)} ${stages[1].cout ? 'wire-pulse' : ''}"/>
            <text x="450" y="230" class="wire-annotation ${valClass(stages[1].cout)}" text-anchor="middle">C2 = ${valText(stages[1].cout)}</text>

            <!-- C3 from FA2 to FA3 -->
            <path d="M 300,240 L 200,240" class="wire ${valClass(stages[2].cout)} ${stages[2].cout ? 'wire-pulse' : ''}"/>
            <text x="250" y="230" class="wire-annotation ${valClass(stages[2].cout)}" text-anchor="middle">C3 = ${valText(stages[2].cout)}</text>

            <!-- Cout from FA3 -->
            <path d="M 100,240 L 20,240" class="wire ${valClass(stages[3].cout)} ${stages[3].cout ? 'wire-pulse' : ''}"/>
            <g class="circuit-pin">
                <rect x="10" y="222" width="75" height="36" rx="6" class="pin-box output-pin"/>
                <text x="47" y="245" class="pin-label">Cout = <tspan class="pin-val ${valClass(stages[3].cout)}">${valText(stages[3].cout)}</tspan></text>
            </g>

            <!-- Render the 4 Full Adder Stages -->
            ${stages.map((stg) => {
                const x = stageX[stg.stage];
                const i = stg.stage;
                const isMSB = i === 3;
                const isLSB = i === 0;

                return `
                <!-- FA Stage ${i} Box -->
                <g class="fa-stage-group" transform="translate(${x}, 160)">
                    <rect x="0" y="0" width="100" height="150" rx="8" class="fa-block"/>
                    <text x="50" y="32" class="fa-title" text-anchor="middle">FA ${i}</text>
                    <text x="50" y="50" class="fa-sub" text-anchor="middle">${isLSB ? '(LSB)' : isMSB ? '(MSB)' : 'Bit ' + i}</text>

                    <!-- Internal pins labels -->
                    <text x="50" y="75" class="fa-pin-name" text-anchor="middle">Cin → Cout</text>
                    <text x="50" y="130" class="fa-pin-name" text-anchor="middle">Sum: ${valText(stg.sum)}</text>
                </g>

                <!-- Input Ai line (from top) -->
                <path d="M ${x + 30},80 L ${x + 30},160" class="wire ${valClass(stg.bitA)}"/>
                <g class="circuit-pin interactive-pin" onclick="App.toggleRippleBit('a', ${i})">
                    <rect x="${x + 8}" y="65" width="44" height="28" rx="4" class="pin-box mini-pin"/>
                    <text x="${x + 30}" y="84" class="pin-label mini-label">A${i}:${valText(stg.bitA)}</text>
                </g>

                <!-- Input Bi line (from top) -->
                <path d="M ${x + 70},80 L ${x + 70},160" class="wire ${valClass(stg.bitY)}"/>
                <g class="circuit-pin interactive-pin" onclick="App.toggleRippleBit('b', ${i})">
                    <rect x="${x + 48}" y="65" width="44" height="28" rx="4" class="pin-box mini-pin"/>
                    <text x="${x + 70}" y="84" class="pin-label mini-label">B${i}:${valText(stg.bitY)}</text>
                </g>

                <!-- Sum Si line (to bottom) -->
                <path d="M ${x + 50},310 L ${x + 50},380" class="wire ${valClass(stg.sum)}"/>
                <g class="circuit-pin">
                    <rect x="${x + 22}" y="380" width="56" height="32" rx="4" class="pin-box output-pin mini-pin"/>
                    <text x="${x + 50}" y="401" class="pin-label mini-label">S${i} = ${valText(stg.sum)}</text>
                </g>
                `;
            }).join('')}

            <!-- 4-Bit Sum Bus Display at the bottom -->
            <rect x="220" y="430" width="520" height="40" rx="8" class="bus-container"/>
            <text x="480" y="455" class="bus-text" text-anchor="middle">
                4-BIT RESULT: S3 S2 S1 S0 = <tspan class="pin-val">${CircuitSimulator.toBinary4(res.result)}</tspan> (${res.result})  |  Cout = <tspan class="pin-val">${valText(res.carryOut)}</tspan>
            </text>
        </svg>`;

        const container = document.getElementById(containerId);
        if (container) container.innerHTML = svg;
    },

    // Generate Multiplexer Selection & Carry Generation SVG
    renderMultiplexerStage(containerId, state = { s1: 0, s0: 1, b: 3 }) {
        const s1 = state.s1 & 1;
        const s0 = state.s0 & 1;
        const b = state.b & 15;
        const mux = CircuitSimulator.selectInputs(0, b, s1, s0);

        const valClass = (v) => (v ? "wire-high" : "wire-low");
        const valText = (v) => (v ? "1" : "0");

        const svg = `
        <svg viewBox="0 0 880 400" width="100%" class="circuit-svg" xmlns="http://www.w3.org/2000/svg">
            <g class="circuit-grid" opacity="0.12">
                ${Array.from({length: 22}, (_, i) => `<line x1="${i*40}" y1="0" x2="${i*40}" y2="400" stroke="#38BDF8" stroke-width="0.5"/>`).join('')}
                ${Array.from({length: 10}, (_, i) => `<line x1="0" y1="${i*40}" x2="880" y2="${i*40}" stroke="#38BDF8" stroke-width="0.5"/>`).join('')}
            </g>

            <text x="440" y="30" class="circuit-title-text" text-anchor="middle">MULTIPLEXER & OPERAND-Y SELECTOR STAGE</text>
            <text x="440" y="50" class="circuit-sub-text" text-anchor="middle">Controls second operand Y and Carry-In according to S1 and S0</text>

            <!-- Control Line S1 -->
            <path d="M 80,80 L 380,80 L 380,140" class="wire ${valClass(s1)}"/>
            <g class="circuit-pin interactive-pin" onclick="App.toggleMuxControl('s1')">
                <rect x="25" y="65" width="55" height="30" rx="4" class="pin-box"/>
                <text x="52" y="85" class="pin-label">S1: ${valText(s1)}</text>
            </g>

            <!-- Control Line S0 -->
            <path d="M 80,120 L 410,120 L 410,140" class="wire ${valClass(s0)}"/>
            <g class="circuit-pin interactive-pin" onclick="App.toggleMuxControl('s0')">
                <rect x="25" y="105" width="55" height="30" rx="4" class="pin-box"/>
                <text x="52" y="125" class="pin-label">S0: ${valText(s0)}</text>
            </g>

            <!-- 4-to-1 Multiplexer Trapezoid Box for Bit i -->
            <polygon points="340,140 450,140 430,310 360,310" class="mux-polygon"/>
            <text x="395" y="180" class="mux-label" text-anchor="middle">4:1 MUX</text>
            <text x="395" y="200" class="mux-sub" text-anchor="middle">(Per Bit i)</text>

            <!-- Data Inputs to MUX (D0=B, D1=B', D2=0, D3=1) -->
            <!-- D0 = B -->
            <path d="M 210,165 L 348,165" class="wire ${valClass(b & 1)}"/>
            <text x="280" y="158" class="wire-annotation">D0 = Bi</text>

            <!-- D1 = NOT B (B') -->
            <path d="M 210,205 L 260,205" class="wire ${valClass(b & 1)}"/>
            <!-- Small Inverter Bubble / NOT Gate -->
            <polygon points="260,195 285,205 260,215" class="gate-body"/>
            <circle cx="288" cy="205" r="3" fill="#0D1527" stroke="#38BDF8" stroke-width="1.5"/>
            <path d="M 292,205 L 352,205" class="wire ${valClass(~b & 1)}"/>
            <text x="320" y="198" class="wire-annotation">D1 = B̅i</text>

            <!-- D2 = 0 (GND) -->
            <path d="M 240,245 L 358,245" class="wire wire-low"/>
            <text x="290" y="240" class="wire-annotation">D2 = 0</text>

            <!-- D3 = 1 (VCC) -->
            <path d="M 240,285 L 362,285" class="wire wire-high"/>
            <text x="290" y="280" class="wire-annotation">D3 = 1</text>

            <!-- MUX Output Yi -->
            <path d="M 395,310 L 395,360 L 580,360" class="wire ${valClass(mux.y & 1)}"/>
            <g class="circuit-pin">
                <rect x="580" y="342" width="160" height="36" rx="6" class="pin-box output-pin"/>
                <text x="660" y="365" class="pin-label">Yi = ${valText(mux.y & 1)} (Y = ${CircuitSimulator.toBinary4(mux.y)})</text>
            </g>

            <!-- Carry-In Logic Box -->
            <rect x="530" y="110" width="260" height="150" rx="8" class="fa-block"/>
            <text x="660" y="135" class="fa-title" text-anchor="middle">CIN GENERATOR LOGIC</text>
            <text x="660" y="155" class="fa-sub" text-anchor="middle">Cin = 1 for Subtraction & Increment</text>
            <text x="660" y="180" class="mux-formula" text-anchor="middle">Cin = (S1' · S0) + (S1 · S0')</text>
            <text x="660" y="200" class="mux-formula" text-anchor="middle">= S1 ⊕ S0</text>
            <path d="M 660,215 L 660,260 L 760,260" class="wire ${valClass(mux.cin)}"/>
            <g class="circuit-pin">
                <rect x="730" y="242" width="110" height="36" rx="6" class="pin-box output-pin"/>
                <text x="785" y="265" class="pin-label">Cin = <tspan class="pin-val ${valClass(mux.cin)}">${valText(mux.cin)}</tspan></text>
            </g>

            <!-- Operation badge -->
            <rect x="80" y="340" width="220" height="40" rx="6" class="bus-container"/>
            <text x="190" y="365" class="bus-text" text-anchor="middle">
                OP: <tspan class="pin-val">${mux.operation.toUpperCase()}</tspan> (${mux.formula})
            </text>
        </svg>`;

        const container = document.getElementById(containerId);
        if (container) container.innerHTML = svg;
    },

    // Generate Master 4-Bit Arithmetic Circuit SVG (Complete Project Circuit)
    renderMasterCircuit(containerId, state = { a: 5, b: 3, s1: 0, s0: 0 }) {
        const a = state.a & 15;
        const b = state.b & 15;
        const s1 = state.s1 & 1;
        const s0 = state.s0 & 1;

        const sim = CircuitSimulator.performOperation(a, b, s1, s0);
        const stages = sim.stages;
        const valClass = (v) => (v ? "wire-high" : "wire-low");
        const valText = (v) => (v ? "1" : "0");

        const svg = `
        <svg viewBox="0 0 1020 620" width="100%" class="circuit-svg" xmlns="http://www.w3.org/2000/svg">
            <g class="circuit-grid" opacity="0.10">
                ${Array.from({length: 26}, (_, i) => `<line x1="${i*40}" y1="0" x2="${i*40}" y2="620" stroke="#38BDF8" stroke-width="0.5"/>`).join('')}
                ${Array.from({length: 16}, (_, i) => `<line x1="0" y1="${i*40}" x2="1020" y2="${i*40}" stroke="#38BDF8" stroke-width="0.5"/>`).join('')}
            </g>

            <!-- Header -->
            <text x="510" y="30" class="circuit-title-text" text-anchor="middle">COMPLETE 4-BIT ARITHMETIC CIRCUIT</text>
            <text x="510" y="50" class="circuit-sub-text" text-anchor="middle">Common 4-Bit Ripple Carry Adder Architecture with Multiplexed Input Y & Cin</text>

            <!-- Control Bus at Top Left -->
            <g transform="translate(60, 60)">
                <rect x="0" y="0" width="220" height="90" rx="6" class="subcircuit-box"/>
                <text x="110" y="24" class="subcircuit-title" text-anchor="middle">CONTROL SELECTORS</text>
                <text x="30" y="52" class="pin-label">S1 = <tspan class="pin-val ${valClass(s1)}">${valText(s1)}</tspan></text>
                <text x="30" y="76" class="pin-label">S0 = <tspan class="pin-val ${valClass(s0)}">${valText(s0)}</tspan></text>
                <text x="140" y="65" class="wire-annotation ${valClass(1)}">${sim.operation}</text>
            </g>

            <!-- Operands A and B at Top -->
            <g transform="translate(320, 60)">
                <rect x="0" y="0" width="300" height="90" rx="6" class="subcircuit-box"/>
                <text x="150" y="24" class="subcircuit-title" text-anchor="middle">4-BIT OPERAND REGISTERS</text>
                <text x="40" y="52" class="pin-label">Operand A = <tspan class="pin-val">${CircuitSimulator.toBinary4(a)}</tspan> (${a})</text>
                <text x="40" y="76" class="pin-label">Operand B = <tspan class="pin-val">${CircuitSimulator.toBinary4(b)}</tspan> (${b})</text>
            </g>

            <!-- Selected Y and Cin Status Box -->
            <g transform="translate(660, 60)">
                <rect x="0" y="0" width="300" height="90" rx="6" class="subcircuit-box"/>
                <text x="150" y="24" class="subcircuit-title" text-anchor="middle">MUX STAGE OUTPUTS</text>
                <text x="40" y="52" class="pin-label">Selected Y = <tspan class="pin-val">${CircuitSimulator.toBinary4(sim.y)}</tspan> (${sim.y})</text>
                <text x="40" y="76" class="pin-label">Carry In (Cin) = <tspan class="pin-val ${valClass(sim.cin)}">${valText(sim.cin)}</tspan></text>
            </g>

            <!-- MUX STAGE ROW (Y0 to Y3) -->
            ${[0, 1, 2, 3].map(i => {
                const x = 740 - i * 200; // Stage 0 at 740, Stage 3 at 140
                const bitB = (b >> i) & 1;
                const bitY = (sim.y >> i) & 1;
                return `
                <g transform="translate(${x}, 180)">
                    <polygon points="0,0 80,0 70,70 10,70" class="mux-polygon"/>
                    <text x="40" y="32" class="mux-label mini-label" text-anchor="middle">MUX ${i}</text>
                    <text x="40" y="50" class="mux-sub" font-size="9" text-anchor="middle">B${i}=${bitB}</text>

                    <!-- Wire entering MUX from top -->
                    <path d="M 40,-25 L 40,0" class="wire ${valClass(bitB)}"/>
                    <!-- Wire from MUX down to Adder Stage -->
                    <path d="M 40,70 L 40,110" class="wire ${valClass(bitY)}"/>
                    <text x="50" y="95" class="wire-annotation ${valClass(bitY)}">Y${i}=${bitY}</text>
                </g>
                `;
            }).join('')}

            <!-- Carry-In wire into Stage 0 -->
            <path d="M 940,360 L 820,360" class="wire ${valClass(sim.cin)} ${sim.cin ? 'wire-pulse' : ''}"/>
            <g class="circuit-pin">
                <rect x="850" y="342" width="75" height="34" rx="4" class="pin-box"/>
                <text x="887" y="364" class="pin-label mini-label">Cin = ${valText(sim.cin)}</text>
            </g>

            <!-- 4 FULL ADDER STAGES ROW -->
            <!-- Ripple Carries: C1, C2, C3, Cout -->
            <path d="M 740,360 L 620,360" class="wire ${valClass(stages[0].cout)} ${stages[0].cout ? 'wire-pulse' : ''}"/>
            <text x="680" y="350" class="wire-annotation ${valClass(stages[0].cout)}" text-anchor="middle">C1 = ${valText(stages[0].cout)}</text>

            <path d="M 540,360 L 420,360" class="wire ${valClass(stages[1].cout)} ${stages[1].cout ? 'wire-pulse' : ''}"/>
            <text x="480" y="350" class="wire-annotation ${valClass(stages[1].cout)}" text-anchor="middle">C2 = ${valText(stages[1].cout)}</text>

            <path d="M 340,360 L 220,360" class="wire ${valClass(stages[2].cout)} ${stages[2].cout ? 'wire-pulse' : ''}"/>
            <text x="280" y="350" class="wire-annotation ${valClass(stages[2].cout)}" text-anchor="middle">C3 = ${valText(stages[2].cout)}</text>

            <!-- Cout out of Stage 3 -->
            <path d="M 140,360 L 50,360 L 50,490 L 100,490" class="wire ${valClass(stages[3].cout)} ${stages[3].cout ? 'wire-pulse' : ''}"/>
            <g class="circuit-pin">
                <rect x="80" y="472" width="100" height="36" rx="6" class="pin-box output-pin"/>
                <text x="130" y="495" class="pin-label">Cout = <tspan class="pin-val ${valClass(stages[3].cout)}">${valText(stages[3].cout)}</tspan></text>
            </g>

            ${stages.map((stg) => {
                const x = 740 - stg.stage * 200;
                const i = stg.stage;
                return `
                <g class="fa-stage-group" transform="translate(${x}, 290)">
                    <rect x="0" y="0" width="80" height="130" rx="8" class="fa-block"/>
                    <text x="40" y="26" class="fa-title mini-title" text-anchor="middle">FA ${i}</text>
                    <text x="40" y="42" class="fa-sub" font-size="9" text-anchor="middle">Bit ${i}</text>

                    <text x="40" y="66" class="fa-pin-name" text-anchor="middle">A${i}:${stg.bitA}</text>
                    <text x="40" y="82" class="fa-pin-name" text-anchor="middle">Y${i}:${stg.bitY}</text>
                    <text x="40" y="112" class="fa-pin-name" text-anchor="middle">S${i}:${stg.sum}</text>
                </g>

                <!-- Ai input line entering from top left -->
                <path d="M ${x + 20},180 L ${x + 20},290" class="wire ${valClass(stg.bitA)}"/>

                <!-- Sum Si line dropping to bus -->
                <path d="M ${x + 40},420 L ${x + 40},490" class="wire ${valClass(stg.sum)}"/>
                <g class="circuit-pin">
                    <rect x="${x + 15}" y="480" width="50" height="32" rx="4" class="pin-box output-pin mini-pin"/>
                    <text x="${x + 40}" y="501" class="pin-label mini-label">S${i}=${valText(stg.sum)}</text>
                </g>
                `;
            }).join('')}

            <!-- Bottom Result Banner -->
            <rect x="220" y="540" width="600" height="55" rx="8" class="bus-container"/>
            <text x="520" y="565" class="bus-text" text-anchor="middle" font-size="16">
                CALCULATION RESULT: ${sim.operation.toUpperCase()} (${sim.formula})
            </text>
            <text x="520" y="585" class="bus-sub" text-anchor="middle" font-size="13">
                Binary Sum = <tspan class="pin-val">${CircuitSimulator.toBinary4(sim.result)}</tspan> | Decimal = ${sim.result} | Cout = ${sim.carryOut} ${sim.signedDiff !== null ? ` | Signed = ${sim.signedDiff}` : ''}
            </text>
        </svg>`;

        const container = document.getElementById(containerId);
        if (container) container.innerHTML = svg;
    },

    // Render Basic Gate (AND, OR, NOT, XOR)
    renderLogicGate(containerId, gateType = 'AND', inA = 1, inB = 0) {
        let outVal = 0;
        let symbolSvg = '';
        const a = inA & 1;
        const b = inB & 1;

        if (gateType === 'AND') {
            outVal = a & b;
            symbolSvg = `
                <path d="M 20,20 L 60,20 Q 100,20 100,45 Q 100,70 60,70 L 20,70 Z" class="gate-body"/>
                <text x="55" y="49" class="gate-label">AND</text>
            `;
        } else if (gateType === 'OR') {
            outVal = a | b;
            symbolSvg = `
                <path d="M 10,20 Q 30,45 10,70 Q 55,68 95,45 Q 55,22 10,20 Z" class="gate-body"/>
                <text x="45" y="49" class="gate-label">OR</text>
            `;
        } else if (gateType === 'XOR') {
            outVal = a ^ b;
            symbolSvg = `
                <path d="M 0,20 Q 20,45 0,70" fill="none" class="gate-body-outline" stroke-width="2.5"/>
                <path d="M 12,20 Q 32,45 12,70 Q 55,68 95,45 Q 55,22 12,20 Z" class="gate-body"/>
                <text x="48" y="49" class="gate-label">XOR</text>
            `;
        } else if (gateType === 'NOT') {
            outVal = a ? 0 : 1;
            symbolSvg = `
                <polygon points="20,20 80,45 20,70" class="gate-body"/>
                <circle cx="85" cy="45" r="4.5" fill="#0D1527" stroke="#38BDF8" stroke-width="2"/>
                <text x="42" y="49" class="gate-label">NOT</text>
            `;
        }

        const valClass = (v) => (v ? "wire-high" : "wire-low");
        const valText = (v) => (v ? "1" : "0");

        const isNot = gateType === 'NOT';

        const svg = `
        <svg viewBox="0 0 380 180" width="100%" class="circuit-svg mini-gate-svg" xmlns="http://www.w3.org/2000/svg">
            <!-- Input A -->
            <path d="M 30,${isNot ? 90 : 65} L 120,${isNot ? 90 : 65}" class="wire ${valClass(a)}"/>
            <g class="circuit-pin interactive-pin" onclick="App.toggleGatePrimitiveBit('${gateType}', 'a')">
                <rect x="5" y="${isNot ? 75 : 50}" width="45" height="28" rx="4" class="pin-box mini-pin"/>
                <text x="27" y="${isNot ? 94 : 69}" class="pin-label mini-label">A:${valText(a)}</text>
            </g>

            ${!isNot ? `
            <!-- Input B -->
            <path d="M 30,115 L 120,115" class="wire ${valClass(b)}"/>
            <g class="circuit-pin interactive-pin" onclick="App.toggleGatePrimitiveBit('${gateType}', 'b')">
                <rect x="5" y="100" width="45" height="28" rx="4" class="pin-box mini-pin"/>
                <text x="27" y="119" class="pin-label mini-label">B:${valText(b)}</text>
            </g>
            ` : ''}

            <!-- Gate Symbol Group -->
            <g class="gate-group" transform="translate(120, 45)">
                ${symbolSvg}
            </g>

            <!-- Output Line -->
            <path d="M ${isNot ? 210 : 220},90 L 290,90" class="wire ${valClass(outVal)}"/>
            <g class="circuit-pin">
                <rect x="290" y="75" width="75" height="30" rx="4" class="pin-box output-pin mini-pin"/>
                <text x="327" y="95" class="pin-label mini-label">Y = ${valText(outVal)}</text>
            </g>
        </svg>`;

        const container = document.getElementById(containerId);
        if (container) container.innerHTML = svg;
    }
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = CircuitDiagrams;
}
