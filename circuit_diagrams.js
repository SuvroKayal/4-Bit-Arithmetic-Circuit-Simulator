/**
 * 4-BIT ARITHMETIC CIRCUIT LABORATORY
 * Complete Gate-Level IEEE Logic Diagrams & Schematic Engine
 * 
 * Contains:
 * - Two 4:1 Multiplexers (Operand Y MUX & Carry-In Cin MUX)
 * - Four Full Adder Stages (FA0 LSB to FA3 MSB)
 * - Every Full Adder constructed from 2 XOR, 2 AND, 1 OR gates (20 total gates)
 * - Real-time signal calculation, active wire highlighting, and step animation
 */

const CircuitDiagrams = {
    toBinary4(num) {
        return (num & 15).toString(2).padStart(4, "0");
    },

    valText(val) {
        return (val & 1) ? "1" : "0";
    },

    wireColorClass(val, baseType = "wire") {
        const isHigh = (val & 1) === 1;
        if (baseType === "ctrl") return "wire-ctrl";
        if (baseType === "carry") return isHigh ? "wire-carry wire-high" : "wire-carry wire-low";
        if (baseType === "a") return isHigh ? "wire-a wire-high" : "wire-a wire-low";
        if (baseType === "y") return isHigh ? "wire-y wire-high" : "wire-y wire-low";
        return isHigh ? "wire-high" : "wire-low";
    },

    valColorClass(val, isCarry = false) {
        const isHigh = (val & 1) === 1;
        if (isCarry) return isHigh ? "val-carry" : "val-low";
        return isHigh ? "val-high" : "val-low";
    },

    /**
     * Renders the complete Gate-Level Schematic of the 4-Bit Arithmetic Circuit
     * 
     * @param {string} containerId - Target DOM container ID
     * @param {object} sim - Simulation output from CircuitSimulator.performOperation
     * @param {number} animStep - 0 = Steady state, 1 = MUX, 2 = FA0, 3 = FA1, 4 = FA2, 5 = FA3, 6 = Output
     */
    renderGateLevelCircuit(containerId, sim, animStep = 0) {
        const { a, b, s1, s0, y, cin, result, carryOut, stages, operation } = sim;

        const isSteady = (animStep === 0 || animStep >= 6);
        const muxReady = animStep >= 1 || isSteady;
        const fa0Ready = animStep >= 2 || isSteady;
        const fa1Ready = animStep >= 3 || isSteady;
        const fa2Ready = animStep >= 4 || isSteady;
        const fa3Ready = animStep >= 5 || isSteady;
        const outReady = animStep >= 6 || isSteady;

        // Selection channel: 00 -> 0, 01 -> 1, 10 -> 2, 11 -> 3
        const muxChannel = (s1 << 1) | s0;

        // Coordinates for the 4 Full Adder stages (FA0 LSB to FA3 MSB)
        // Arranged horizontally from left to right
        const faX = [70, 380, 690, 1000]; // Stage width is 280, gap is 30
        const stageReady = [fa0Ready, fa1Ready, fa2Ready, fa3Ready];

        const svg = `
        <svg viewBox="0 0 1380 770" class="main-circuit-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <marker id="arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 1 L 7 4 L 0 7 z" fill="#475569"/>
                </marker>
                <marker id="arrow-high" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 1 L 7 4 L 0 7 z" fill="#16865B"/>
                </marker>
                <marker id="arrow-carry" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 1 L 7 4 L 0 7 z" fill="#DC5555"/>
                </marker>
            </defs>

            <!-- Grid pattern background (subtle) -->
            <g opacity="0.04">
                ${Array.from({length: 46}, (_, i) => `<line x1="${i*30}" y1="0" x2="${i*30}" y2="770" stroke="#1E293B" stroke-width="0.5"/>`).join('')}
                ${Array.from({length: 26}, (_, i) => `<line x1="0" y1="${i*30}" x2="1380" y2="${i*30}" stroke="#1E293B" stroke-width="0.5"/>`).join('')}
            </g>

            <!-- ==========================================================
                 TOP HEADER & CONTROL LINES DISTRIBUTION (S1, S0)
                 ========================================================== -->
            <g transform="translate(30, 20)">
                <rect x="0" y="0" width="160" height="60" rx="3" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.2"/>
                <text x="80" y="18" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="#26845B" text-anchor="middle">CONTROL BUS (S1, S0)</text>
                <text x="30" y="38" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#26845B">S1 = ${s1}</text>
                <text x="30" y="52" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#26845B">S0 = ${s0}</text>
                <text x="110" y="45" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="#1E293B">${operation.toUpperCase()}</text>
            </g>

            <!-- S1 and S0 Distribution Lines across top -->
            <!-- S1 Line (Green) -->
            <path d="M 190, 35 L 1260, 35" class="wire wire-ctrl"/>
            <text x="195" y="30" class="signal-tag" fill="#26845B">S1</text>

            <!-- S0 Line (Green) -->
            <path d="M 190, 50 L 1280, 50" class="wire wire-ctrl"/>
            <text x="195" y="47" class="signal-tag" fill="#26845B">S0</text>


            <!-- ==========================================================
                 UPPER-MIDDLE: 4:1 MULTIPLEXER FOR SECOND OPERAND Y
                 ========================================================== -->
            <g transform="translate(230, 95)">
                <!-- MUX Sub-panel outline -->
                <rect x="0" y="0" width="460" height="175" rx="4" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.2"/>
                <text x="230" y="20" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#7C3AED" text-anchor="middle">
                    SECOND OPERAND MULTIPLEXER (4:1 MUX FOR Y)
                </text>

                <!-- Tap S1 and S0 into Y MUX -->
                <path d="M 150, -60 L 150, 35" class="wire wire-ctrl"/>
                <circle cx="380" cy="35" r="3" fill="#26845B"/>
                <path d="M 170, -45 L 170, 35" class="wire wire-ctrl"/>
                <circle cx="400" cy="50" r="3" fill="#26845B"/>
                <text x="145" y="32" class="signal-tag" fill="#26845B">S1</text>
                <text x="175" y="32" class="signal-tag" fill="#26845B">S0</text>

                <!-- Input Path D0: B (4 bits) -->
                <g transform="translate(20, 35)">
                    <rect x="0" y="0" width="75" height="24" rx="2" fill="#FFFFFF" stroke="${muxChannel === 0 ? '#7C3AED' : '#CBD5E1'}" stroke-width="${muxChannel === 0 ? '1.8' : '1'}"/>
                    <text x="37" y="16" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="600" fill="#1E293B" text-anchor="middle">
                        D0: B (${this.toBinary4(b)})
                    </text>
                    <path d="M 75, 12 L 190, 12 L 230, 75" class="wire ${muxChannel === 0 ? 'wire-y wire-high' : 'wire-low'}"/>
                </g>

                <!-- Input Path D1: NOT B (B̅, 4 bits via inverters) -->
                <g transform="translate(20, 68)">
                    <rect x="0" y="0" width="75" height="24" rx="2" fill="#FFFFFF" stroke="${muxChannel === 1 ? '#7C3AED' : '#CBD5E1'}" stroke-width="${muxChannel === 1 ? '1.8' : '1'}"/>
                    <text x="37" y="16" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="600" fill="#1E293B" text-anchor="middle">
                        D1: B̅ (${this.toBinary4(b ^ 15)})
                    </text>
                    <!-- Inverter Symbol -->
                    <polygon points="100,74 116,80 100,86" class="gate-body"/>
                    <circle cx="119" cy="80" r="2.5" fill="#FFFFFF" stroke="#475569" stroke-width="1.2"/>
                    <path d="M 75, 12 L 100, 12" class="wire"/>
                    <path d="M 122, 12 L 190, 12 L 230, 80" class="wire ${muxChannel === 1 ? 'wire-y wire-high' : 'wire-low'}"/>
                </g>

                <!-- Input Path D2: 0000 (GND) -->
                <g transform="translate(20, 101)">
                    <rect x="0" y="0" width="75" height="24" rx="2" fill="#FFFFFF" stroke="${muxChannel === 2 ? '#7C3AED' : '#CBD5E1'}" stroke-width="${muxChannel === 2 ? '1.8' : '1'}"/>
                    <text x="37" y="16" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="600" fill="#1E293B" text-anchor="middle">
                        D2: 0000 (0)
                    </text>
                    <path d="M 75, 12 L 190, 12 L 230, 85" class="wire ${muxChannel === 2 ? 'wire-y wire-high' : 'wire-low'}"/>
                </g>

                <!-- Input Path D3: 1111 (VCC / Logic -1) -->
                <g transform="translate(20, 134)">
                    <rect x="0" y="0" width="75" height="24" rx="2" fill="#FFFFFF" stroke="${muxChannel === 3 ? '#7C3AED' : '#CBD5E1'}" stroke-width="${muxChannel === 3 ? '1.8' : '1'}"/>
                    <text x="37" y="16" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="600" fill="#1E293B" text-anchor="middle">
                        D3: 1111 (15)
                    </text>
                    <path d="M 75, 12 L 190, 12 L 230, 90" class="wire ${muxChannel === 3 ? 'wire-y wire-high' : 'wire-low'}"/>
                </g>

                <!-- Trapezoid MUX Symbol -->
                <g transform="translate(230, 45)">
                    <polygon points="0,15 65,30 65,85 0,100" fill="#FFFFFF" stroke="#475569" stroke-width="1.8"/>
                    <text x="28" y="58" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="#1E293B" text-anchor="middle">
                        4:1 MUX
                    </text>
                    <text x="28" y="70" font-family="'JetBrains Mono', monospace" font-size="8" fill="#64748B" text-anchor="middle">
                        [4-Bit]
                    </text>
                </g>

                <!-- MUX Output Y Bus -->
                <path d="M 295, 102 L 340, 102" class="wire wire-y wire-high" stroke-width="2.6" marker-end="url(#arrow)"/>
                <g transform="translate(340, 85)">
                    <rect x="0" y="0" width="105" height="34" rx="3" fill="#FFFFFF" stroke="#7C3AED" stroke-width="1.5"/>
                    <text x="52" y="16" font-family="'JetBrains Mono', monospace" font-size="9" fill="#7C3AED" text-anchor="middle">OUTPUT Y[3:0]</text>
                    <text x="52" y="28" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#1E293B" text-anchor="middle">
                        Y = ${muxReady ? this.toBinary4(y) : '----'} (${muxReady ? y : '-'})
                    </text>
                </g>
            </g>


            <!-- ==========================================================
                 UPPER-RIGHT: 4:1 MULTIPLEXER FOR CARRY-IN (Cin)
                 ========================================================== -->
            <g transform="translate(730, 95)">
                <!-- Cin MUX Sub-panel outline -->
                <rect x="0" y="0" width="460" height="175" rx="4" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.2"/>
                <text x="230" y="20" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#DC5555" text-anchor="middle">
                    CARRY-IN MULTIPLEXER (4:1 MUX FOR Cin)
                </text>

                <!-- Tap S1 and S0 into Cin MUX -->
                <path d="M 150, -60 L 150, 35" class="wire wire-ctrl"/>
                <circle cx="880" cy="35" r="3" fill="#26845B"/>
                <path d="M 170, -45 L 170, 35" class="wire wire-ctrl"/>
                <circle cx="900" cy="50" r="3" fill="#26845B"/>
                <text x="145" y="32" class="signal-tag" fill="#26845B">S1</text>
                <text x="175" y="32" class="signal-tag" fill="#26845B">S0</text>

                <!-- Cin Input Path D0: 0 (Addition) -->
                <g transform="translate(25, 35)">
                    <rect x="0" y="0" width="70" height="24" rx="2" fill="#FFFFFF" stroke="${muxChannel === 0 ? '#DC5555' : '#CBD5E1'}" stroke-width="${muxChannel === 0 ? '1.8' : '1'}"/>
                    <text x="35" y="16" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="600" fill="#1E293B" text-anchor="middle">D0: 0 (Add)</text>
                    <path d="M 70, 12 L 180, 12 L 230, 75" class="wire ${muxChannel === 0 ? 'wire-carry wire-high' : 'wire-low'}"/>
                </g>

                <!-- Cin Input Path D1: 1 (Subtraction) -->
                <g transform="translate(25, 68)">
                    <rect x="0" y="0" width="70" height="24" rx="2" fill="#FFFFFF" stroke="${muxChannel === 1 ? '#DC5555' : '#CBD5E1'}" stroke-width="${muxChannel === 1 ? '1.8' : '1'}"/>
                    <text x="35" y="16" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="600" fill="#1E293B" text-anchor="middle">D1: 1 (Sub)</text>
                    <path d="M 70, 12 L 180, 12 L 230, 80" class="wire ${muxChannel === 1 ? 'wire-carry wire-high' : 'wire-low'}"/>
                </g>

                <!-- Cin Input Path D2: 1 (Increment) -->
                <g transform="translate(25, 101)">
                    <rect x="0" y="0" width="70" height="24" rx="2" fill="#FFFFFF" stroke="${muxChannel === 2 ? '#DC5555' : '#CBD5E1'}" stroke-width="${muxChannel === 2 ? '1.8' : '1'}"/>
                    <text x="35" y="16" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="600" fill="#1E293B" text-anchor="middle">D2: 1 (Inc)</text>
                    <path d="M 70, 12 L 180, 12 L 230, 85" class="wire ${muxChannel === 2 ? 'wire-carry wire-high' : 'wire-low'}"/>
                </g>

                <!-- Cin Input Path D3: 0 (Decrement) -->
                <g transform="translate(25, 134)">
                    <rect x="0" y="0" width="70" height="24" rx="2" fill="#FFFFFF" stroke="${muxChannel === 3 ? '#DC5555' : '#CBD5E1'}" stroke-width="${muxChannel === 3 ? '1.8' : '1'}"/>
                    <text x="35" y="16" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="600" fill="#1E293B" text-anchor="middle">D3: 0 (Dec)</text>
                    <path d="M 70, 12 L 180, 12 L 230, 90" class="wire ${muxChannel === 3 ? 'wire-carry wire-high' : 'wire-low'}"/>
                </g>

                <!-- Trapezoid Cin MUX Symbol -->
                <g transform="translate(230, 45)">
                    <polygon points="0,15 65,30 65,85 0,100" fill="#FFFFFF" stroke="#475569" stroke-width="1.8"/>
                    <text x="28" y="58" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="#1E293B" text-anchor="middle">
                        4:1 MUX
                    </text>
                    <text x="28" y="70" font-family="'JetBrains Mono', monospace" font-size="8" fill="#64748B" text-anchor="middle">
                        [Cin]
                    </text>
                </g>

                <!-- Cin Output Line -->
                <path d="M 295, 102 L 350, 102" class="wire wire-carry wire-high" stroke-width="2.2" marker-end="url(#arrow-carry)"/>
                <g transform="translate(350, 85)">
                    <rect x="0" y="0" width="95" height="34" rx="3" fill="#FFFFFF" stroke="#DC5555" stroke-width="1.5"/>
                    <text x="47" y="16" font-family="'JetBrains Mono', monospace" font-size="9" fill="#DC5555" text-anchor="middle">SELECTED Cin</text>
                    <text x="47" y="28" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#1E293B" text-anchor="middle">
                        Cin = ${muxReady ? cin : '-'}
                    </text>
                </g>
            </g>


            <!-- ==========================================================
                 ROUTING CARRY-IN (Cin) WIRE FROM CIN MUX TO FA0 (LSB)
                 ========================================================== -->
            <!-- Wire drops from Cin MUX, travels left around FA0, and enters at y=510 -->
            <path d="M 1175, 197 L 1220, 197 L 1220, 285 L 40, 285 L 40, 520 L 70, 520" 
                  class="wire ${muxReady ? this.wireColorClass(cin, 'carry') : 'wire-low'}" 
                  stroke-width="2" marker-end="url(#arrow-carry)"/>
            <g transform="translate(15, 395)">
                <rect x="0" y="0" width="50" height="22" rx="2" fill="#FFFFFF" stroke="#DC5555" stroke-width="1"/>
                <text x="25" y="15" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="#DC5555" text-anchor="middle">
                    Cin = ${muxReady ? cin : '-'}
                </text>
            </g>


            <!-- ==========================================================
                 CENTRAL SECTION: FOUR FULL ADDERS (FA0 - FA3)
                 EACH CONSTRUCTED FROM 2 XOR, 2 AND, 1 OR GATE!
                 ========================================================== -->
            ${[0, 1, 2, 3].map(i => {
                const x0 = faX[i];
                const stg = stages[i];
                const isReady = stageReady[i];
                const isCurrent = animStep === (i + 2);

                const bitA = (a >> i) & 1;
                const bitY = (y >> i) & 1;
                const cinVal = stg.cin;
                const pVal = stg.p;
                const gVal = stg.g;
                const hVal = stg.h;
                const sumVal = stg.sum;
                const coutVal = stg.cout;

                // Carry wire to next stage
                const nextX = (i < 3) ? faX[i + 1] : 1310;

                return `
                <!-- Stage ${i} Enclosure Box -->
                <rect x="${x0}" y="300" width="280" height="360" rx="4" 
                      class="stage-enclosure" 
                      stroke="${isCurrent ? '#DC5555' : '#CBD5E1'}" 
                      stroke-width="${isCurrent ? '2' : '1.2'}"/>
                
                <!-- Stage Header -->
                <text x="${x0 + 140}" y="322" class="stage-title" text-anchor="middle">
                    STAGE ${i}: FULL ADDER ${i} ${i === 0 ? '(LSB)' : i === 3 ? '(MSB)' : ''}
                </text>

                <!-- Input Wire A${i} entering from top -->
                <path d="M ${x0 + 40}, 280 L ${x0 + 40}, 375 L ${x0 + 70}, 375" 
                      class="wire ${this.wireColorClass(bitA, 'a')}"/>
                <!-- Branch A${i} down to AND 1 -->
                <path d="M ${x0 + 40}, 375 L ${x0 + 40}, 435 L ${x0 + 70}, 435" 
                      class="wire ${this.wireColorClass(bitA, 'a')}"/>
                <circle cx="${x0 + 40}" cy="375" r="2.5" fill="#2563EB"/>
                
                <!-- Pin A${i} Display -->
                <g class="interactive-pin" onclick="App.toggleSimBit('A', ${i})" style="cursor: pointer;" transform="translate(${x0 + 15}, 265)">
                    <rect x="0" y="0" width="45" height="20" rx="2" class="pin-box" stroke="#2563EB"/>
                    <text x="22" y="14" class="pin-text" text-anchor="middle">A${i}=<tspan class="${this.valColorClass(bitA)}">${bitA}</tspan></text>
                </g>

                <!-- Input Wire Y${i} entering from top -->
                <path d="M ${x0 + 60}, 280 L ${x0 + 60}, 390 L ${x0 + 70}, 390" 
                      class="wire ${muxReady ? this.wireColorClass(bitY, 'y') : 'wire-low'}"/>
                <!-- Branch Y${i} down to AND 1 -->
                <path d="M ${x0 + 60}, 390 L ${x0 + 60}, 450 L ${x0 + 70}, 450" 
                      class="wire ${muxReady ? this.wireColorClass(bitY, 'y') : 'wire-low'}"/>
                <circle cx="${x0 + 60}" cy="390" r="2.5" fill="#7C3AED"/>
                
                <!-- Pin Y${i} Display -->
                <g transform="translate(${x0 + 65}, 265)">
                    <rect x="0" y="0" width="45" height="20" rx="2" class="pin-box" stroke="#7C3AED"/>
                    <text x="22" y="14" class="pin-text" text-anchor="middle">Y${i}=<tspan class="${muxReady ? this.valColorClass(bitY) : 'val-low'}">${muxReady ? bitY : '-'}</tspan></text>
                </g>


                <!-- ================= GATE 1: XOR 1 (P = A XOR Y) ================= -->
                <g transform="translate(${x0 + 70}, 365)">
                    <!-- XOR Gate Outline -->
                    <path d="M 0,0 Q 15,18 0,36" fill="none" stroke="#475569" stroke-width="1.6"/>
                    <path d="M 6,0 Q 20,18 6,36 Q 35,34 50,18 Q 35,2 6,0 Z" class="gate-body"/>
                    <text x="25" y="22" class="gate-label" text-anchor="middle">XOR1</text>
                </g>
                <!-- Wire P = A XOR Y -->
                <path d="M ${x0 + 120}, 383 L ${x0 + 160}, 383 L ${x0 + 160}, 510 L ${x0 + 180}, 510" 
                      class="wire ${isReady ? this.wireColorClass(pVal) : 'wire-low'}"/>
                <!-- Branch P down to AND 2 -->
                <path d="M ${x0 + 160}, 510 L ${x0 + 160}, 590 L ${x0 + 180}, 590" 
                      class="wire ${isReady ? this.wireColorClass(pVal) : 'wire-low'}"/>
                <circle cx="${x0 + 160}" cy="510" r="2.5" fill="#475569"/>
                <text x="${x0 + 130}" y="377" class="signal-tag">P${i}=${isReady ? pVal : '-'}</text>


                <!-- ================= GATE 2: AND 1 (G = A AND Y) ================= -->
                <g transform="translate(${x0 + 70}, 430)">
                    <!-- AND Gate Outline -->
                    <path d="M 0,0 L 25,0 Q 48,0 48,18 Q 48,36 25,36 L 0,36 Z" class="gate-body"/>
                    <text x="22" y="22" class="gate-label" text-anchor="middle">AND1</text>
                </g>
                <!-- Wire G = A AND Y leading into OR gate -->
                <path d="M ${x0 + 118}, 448 L ${x0 + 225}, 448" 
                      class="wire ${isReady ? this.wireColorClass(gVal) : 'wire-low'}"/>
                <text x="${x0 + 130}" y="442" class="signal-tag">G${i}=${isReady ? gVal : '-'}</text>


                <!-- ================= GATE 3: XOR 2 (SUM = P XOR Cin) ================= -->
                <!-- Cin wire branch into XOR 2 and AND 2 -->
                <path d="M ${x0}, 525 L ${x0 + 145}, 525 L ${x0 + 145}, 525 L ${x0 + 180}, 525" 
                      class="wire ${isReady ? this.wireColorClass(cinVal, 'carry') : 'wire-low'}"/>
                <!-- Branch Cin down to AND 2 -->
                <path d="M ${x0 + 145}, 525 L ${x0 + 145}, 605 L ${x0 + 180}, 605" 
                      class="wire ${isReady ? this.wireColorClass(cinVal, 'carry') : 'wire-low'}"/>
                <circle cx="${x0 + 145}" cy="525" r="2.5" fill="#DC5555"/>
                <text x="${x0 + 5}" y="520" class="signal-tag" fill="#DC5555">C${i-1 < 0 ? 'in' : i-1}=${isReady ? cinVal : '-'}</text>

                <g transform="translate(${x0 + 180}, 505)">
                    <path d="M 0,0 Q 15,18 0,36" fill="none" stroke="#475569" stroke-width="1.6"/>
                    <path d="M 6,0 Q 20,18 6,36 Q 35,34 50,18 Q 35,2 6,0 Z" class="gate-body"/>
                    <text x="25" y="22" class="gate-label" text-anchor="middle">XOR2</text>
                </g>
                
                <!-- Output Wire SUM${i} dropping down to result bus -->
                <path d="M ${x0 + 230}, 523 L ${x0 + 250}, 523 L ${x0 + 250}, 690" 
                      class="wire ${isReady ? this.wireColorClass(sumVal) : 'wire-low'}" 
                      stroke-width="2" marker-end="url(#arrow)"/>
                <text x="${x0 + 235}" y="515" class="signal-tag" fill="#16865B">S${i}=${isReady ? sumVal : '-'}</text>


                <!-- ================= GATE 4: AND 2 (H = P AND Cin) ================= -->
                <g transform="translate(${x0 + 180}, 585)">
                    <path d="M 0,0 L 25,0 Q 48,0 48,18 Q 48,36 25,36 L 0,36 Z" class="gate-body"/>
                    <text x="22" y="22" class="gate-label" text-anchor="middle">AND2</text>
                </g>
                <!-- Wire H = P AND Cin up to OR gate -->
                <path d="M ${x0 + 228}, 603 L ${x0 + 240}, 603 L ${x0 + 240}, 462 L ${x0 + 245}, 462" 
                      class="wire ${isReady ? this.wireColorClass(hVal) : 'wire-low'}"/>
                <text x="${x0 + 215}" y="580" class="signal-tag">H${i}=${isReady ? hVal : '-'}</text>


                <!-- ================= GATE 5: OR 1 (Cout = G OR H) ================= -->
                <g transform="translate(${x0 + 225}, 440)">
                    <path d="M 0,0 Q 15,18 0,36 Q 30,34 50,18 Q 30,2 0,0 Z" class="gate-body"/>
                    <text x="22" y="22" class="gate-label" text-anchor="middle">OR</text>
                </g>

                <!-- Carry Output Wire from OR gate to next stage -->
                <path d="M ${x0 + 275}, 458 L ${nextX}, 458 ${i < 3 ? `L ${nextX}, 525 L ${nextX + 30}, 525` : ''}" 
                      class="wire ${isReady ? this.wireColorClass(coutVal, 'carry') : 'wire-low'}" 
                      stroke-width="2.2" marker-end="url(#arrow-carry)"/>
                
                <!-- Carry Label between stages -->
                <g transform="translate(${x0 + 240}, 430)">
                    <text x="25" y="0" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="#DC5555" text-anchor="middle">
                        C${i}=${isReady ? coutVal : '-'}
                    </text>
                </g>
                `;
            }).join('')}


            <!-- ==========================================================
                 FINAL CARRY-OUT BOX (MSB STAGE 3 COUT)
                 ========================================================== -->
            <!-- Wire from FA3 OR gate down to Cout display box -->
            <path d="M 1310, 458 L 1330, 458 L 1330, 680" class="wire ${fa3Ready ? this.wireColorClass(carryOut, 'carry') : 'wire-low'}" stroke-width="2.4" marker-end="url(#arrow-carry)"/>
            <g transform="translate(1275, 680)">
                <rect x="0" y="0" width="95" height="42" rx="3" fill="#FFFFFF" stroke="#DC5555" stroke-width="1.6"/>
                <text x="47" y="16" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="#DC5555" text-anchor="middle">FINAL CARRY-OUT</text>
                <text x="47" y="32" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700" fill="#1E293B" text-anchor="middle">
                    Cout = <tspan fill="${outReady && carryOut ? '#DC5555' : '#64748B'}">${outReady ? carryOut : '-'}</tspan>
                </text>
            </g>


            <!-- ==========================================================
                 BOTTOM RESULT BUS (S3 S2 S1 S0)
                 ========================================================== -->
            ${[0, 1, 2, 3].map(i => {
                const x0 = faX[i] + 250;
                const isReady = stageReady[i];
                const sumBit = (result >> i) & 1;

                return `
                <g transform="translate(${x0 - 25}, 680)">
                    <rect x="0" y="0" width="50" height="42" rx="3" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.4"/>
                    <text x="25" y="16" font-family="'JetBrains Mono', monospace" font-size="9" fill="#64748B" text-anchor="middle">SUM S${i}</text>
                    <text x="25" y="33" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="800" fill="${isReady && sumBit ? '#16865B' : '#64748B'}" text-anchor="middle">
                        ${isReady ? sumBit : '-'}
                    </text>
                </g>
                `;
            }).join('')}

            <!-- Output Bus Label -->
            <g transform="translate(70, 730)">
                <rect x="0" y="0" width="1200" height="30" rx="3" fill="#F0F3F7" stroke="#CBD5E1" stroke-width="1"/>
                <text x="600" y="20" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#1E293B" text-anchor="middle">
                    FOUR-BIT RESULT VECTOR: [S3 S2 S1 S0] = ${outReady ? this.toBinary4(result) : '----'} &nbsp;|&nbsp; 
                    DECIMAL = ${outReady ? result : '--'} &nbsp;|&nbsp; 
                    CARRY-OUT (Cout) = ${outReady ? carryOut : '-'}
                    ${sim.signedDiff !== null && outReady ? ` &nbsp;|&nbsp; SIGNED (A - B) = ${sim.signedDiff}` : ''}
                </text>
            </g>

        </svg>`;

        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = svg;
        }
    }
};

// Export for module environments
if (typeof module !== "undefined" && module.exports) {
    module.exports = CircuitDiagrams;
}
