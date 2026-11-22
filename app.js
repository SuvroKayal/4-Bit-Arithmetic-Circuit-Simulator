/**
 * 4-BIT ARITHMETIC CIRCUIT LABORATORY
 * Application State Controller & Real-Time Simulation Engine
 */

const App = {
    state: {
        simA: 5,
        simB: 3,
        simS1: 0,
        simS0: 0,

        // Step-by-Step Simulation State
        // 0: Steady state (all calculated)
        // 1: MUX operand Y & Cin evaluated
        // 2: FA0 gates evaluate (P0, G0, H0, SUM0, C0)
        // 3: Carry C0 propagates to FA1 (P1, G1, H1, SUM1, C1)
        // 4: Carry C1 propagates to FA2 (P2, G2, H2, SUM2, C2)
        // 5: Carry C2 propagates to FA3 (P3, G3, H3, SUM3, Cout)
        // 6: Output bus settled
        animStep: 0,
        animating: false,
        animPaused: false,
        animTimer: null,
        stepDelay: 1000,

        // Audio
        soundEnabled: false,

        // Python code view file
        activeCodeFile: "arithmetic_circuit.py"
    },

    // Reference Python code for verification view
    repoFiles: {
        "arithmetic_circuit.py": {
            title: "arithmetic_circuit.py - Top-Level Orchestration",
            purpose: "Connects Multiplexer operand selection to the 4-bit Full Adder to execute Total = A + Y + Cin.",
            code: `"""
Main Arithmetic Circuit
Connects Multiplexer and 4-bit Full Adder.
"""

from multiplexer import select_inputs
from full_adder import four_bit_adder


def perform_operation(a, b, s1, s0):

    # Restrict inputs to 4 bits
    a = a & 15
    b = b & 15

    # Select Y and Cin using multiplexer
    y, cin, operation = select_inputs(a, b, s1, s0)

    # Perform addition using 4-bit full adder
    result, carry_out = four_bit_adder(a, y, cin)

    # Return all important values
    return operation, y, cin, result, carry_out`
        },
        "full_adder.py": {
            title: "full_adder.py - 1-Bit & 4-Bit Adder Logic",
            purpose: "Implements single Full Adder (Sum = A ⊕ B ⊕ Cin, Cout = AB + Cin(A⊕B)) and cascades four into a Ripple Carry Adder.",
            code: `"""
4-bit Full Adder Module
Uses four 1-bit full adders.
"""

def full_adder(a, b, cin):

    # Calculate Sum
    sum_bit = a ^ b ^ cin

    # Calculate Carry
    carry_out = (a & b) | (cin & (a ^ b))

    return sum_bit, carry_out


def four_bit_adder(a, b, cin):

    result = 0
    carry = cin

    # Add four bits one by one
    for i in range(4):

        # Extract individual bits
        bit_a = (a >> i) & 1
        bit_b = (b >> i) & 1

        # Perform full addition
        sum_bit, carry = full_adder(bit_a, bit_b, carry)

        # Store result bit
        result = result | (sum_bit << i)

    return result, carry`
        },
        "multiplexer.py": {
            title: "multiplexer.py - Control Line Decoding",
            purpose: "Selects second operand Y (B, B', 0000, 1111) and Cin (0 or 1) based on control lines S1 and S0.",
            code: `"""
Multiplexer Module
Selects Y and Cin using control lines S1 and S0.
"""

def select_inputs(a, b, s1, s0):

    # Addition: S1S0 = 00
    if s1 == 0 and s0 == 0:
        y = b
        cin = 0
        operation = "Addition"

    # Subtraction: S1S0 = 01
    elif s1 == 0 and s0 == 1:
        y = b ^ 15
        cin = 1
        operation = "Subtraction"

    # Increment: S1S0 = 10
    elif s1 == 1 and s0 == 0:
        y = 0
        cin = 1
        operation = "Increment"

    # Decrement: S1S0 = 11
    else:
        y = 15
        cin = 0
        operation = "Decrement"

    return y, cin, operation`
        },
        "main.py": {
            title: "main.py - Interactive CLI Controller",
            purpose: "Provides command-line interactive menu, 0-15 bit range validation, and formatted calculation output.",
            code: `"""
Main Controller for 4-bit Arithmetic Circuit Simulator.
"""

from arithmetic_circuit import perform_operation


def get_input(message):
    while True:
        try:
            number = int(input(message))
            if 0 <= number <= 15:
                return number
            print("Enter a number between 0 and 15.")
        except ValueError:
            print("Invalid input. Please enter a number.")


def main():
    print("=" * 50)
    print("       4-BIT ARITHMETIC CIRCUIT SIMULATOR")
    print("=" * 50)
    # Interactive menu and calculation execution
    ...`
        },
        "test_circuit.py": {
            title: "test_circuit.py - Automated 1,024 Test Cases",
            purpose: "Exhaustively runs 256 tests per operation (1,024 total) to verify 100% mathematical and hardware correctness.",
            code: `"""
Testing all four operations of the 4-bit Arithmetic Circuit.
"""

from arithmetic_circuit import perform_operation


def test_circuit():
    operations = [
        (0, 0, "Addition"),
        (0, 1, "Subtraction"),
        (1, 0, "Increment"),
        (1, 1, "Decrement")
    ]
    for s1, s0, name in operations:
        # Runs all 256 combinations of A and B per operation
        ...`
        }
    },

    init() {
        this.updateSimulationUI();
        this.renderFilePreview(this.state.activeCodeFile);
        this.runAutomatedTests(false);
        this.setupKeyboardShortcuts();
        console.log("4-Bit Arithmetic Circuit Laboratory initialized.");
    },

    playClick(freq = 800) {
        if (!this.state.soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.035);

            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.035);
        } catch (e) {
            // Audio context not active
        }
    },

    toggleSound() {
        this.state.soundEnabled = !this.state.soundEnabled;
        const btn = document.getElementById("sound-toggle-btn");
        if (btn) {
            btn.textContent = this.state.soundEnabled ? "Sound: ON" : "Sound: OFF";
        }
    },

    // ==========================================
    // SELECTION LINE & INPUT CONTROLS
    // ==========================================

    toggleSelectionLine(line) {
        if (line === 'S1') {
            this.state.simS1 = this.state.simS1 ? 0 : 1;
        } else if (line === 'S0') {
            this.state.simS0 = this.state.simS0 ? 0 : 1;
        }
        this.playClick(900);
        this.state.animStep = 0;
        this.pauseAnimation();
        this.updateSimulationUI();
    },

    setOperation(s1, s0) {
        this.state.simS1 = s1;
        this.state.simS0 = s0;
        this.playClick(900);
        this.state.animStep = 0;
        this.pauseAnimation();
        this.updateSimulationUI();
    },

    toggleSimBit(operand, bitIndex) {
        const mask = 1 << bitIndex;
        if (operand === 'A') {
            this.state.simA ^= mask;
        } else if (operand === 'B') {
            this.state.simB ^= mask;
        }
        this.playClick(850);
        this.state.animStep = 0;
        this.pauseAnimation();
        this.updateSimulationUI();
    },

    setOperandDecimal(operand, val) {
        let num = parseInt(val, 10);
        if (isNaN(num)) num = 0;
        num = Math.max(0, Math.min(15, num));

        if (operand === 'A') {
            this.state.simA = num;
        } else {
            this.state.simB = num;
        }
        this.state.animStep = 0;
        this.pauseAnimation();
        this.updateSimulationUI();
    },

    applyPreset(a, b) {
        this.state.simA = a & 15;
        this.state.simB = b & 15;
        this.playClick(750);
        this.state.animStep = 0;
        this.pauseAnimation();
        this.updateSimulationUI();
    },

    randomizeInputs() {
        this.state.simA = Math.floor(Math.random() * 16);
        this.state.simB = Math.floor(Math.random() * 16);
        this.playClick(950);
        this.state.animStep = 0;
        this.pauseAnimation();
        this.updateSimulationUI();
    },

    resetCircuit() {
        this.pauseAnimation();
        this.state.animStep = 0;
        this.state.simA = 5;
        this.state.simB = 3;
        this.state.simS1 = 0;
        this.state.simS0 = 0;
        this.playClick(600);
        this.updateSimulationUI();
    },

    // ==========================================
    // SIMULATION STEPPER CONTROLLER
    // ==========================================

    runAnimation() {
        if (this.state.animating && !this.state.animPaused) return;

        if (this.state.animStep >= 6 || this.state.animStep === 0) {
            this.state.animStep = 1;
        }

        this.state.animating = true;
        this.state.animPaused = false;
        this.updateExecutionButtons();
        this.playClick(700);

        this.updateSimulationUI();

        clearInterval(this.state.animTimer);
        this.state.animTimer = setInterval(() => {
            if (this.state.animStep < 6) {
                this.state.animStep++;
                this.playClick(600 + this.state.animStep * 100);
                this.updateSimulationUI();
            } else {
                clearInterval(this.state.animTimer);
                this.state.animating = false;
                this.state.animPaused = false;
                this.updateExecutionButtons();
                this.updateSimulationUI();
            }
        }, this.state.stepDelay);
    },

    pauseAnimation() {
        if (this.state.animTimer) {
            clearInterval(this.state.animTimer);
            this.state.animTimer = null;
        }
        if (this.state.animating) {
            this.state.animPaused = true;
        }
        this.updateExecutionButtons();
    },

    resumeAnimation() {
        if (this.state.animPaused) {
            this.runAnimation();
        }
    },

    stepForward() {
        this.pauseAnimation();
        if (this.state.animStep < 6) {
            this.state.animStep++;
        } else {
            this.state.animStep = 1;
        }
        this.playClick(800 + this.state.animStep * 50);
        this.updateExecutionButtons();
        this.updateSimulationUI();
    },

    stepBackward() {
        this.pauseAnimation();
        if (this.state.animStep > 1) {
            this.state.animStep--;
        } else {
            this.state.animStep = 0;
        }
        this.playClick(650);
        this.updateExecutionButtons();
        this.updateSimulationUI();
    },

    setAnimationSpeed(val) {
        this.state.stepDelay = parseInt(val, 10);
        const lbl = document.getElementById("speed-readout-lbl");
        if (lbl) {
            lbl.textContent = `${(this.state.stepDelay / 1000).toFixed(1)}s / stage`;
        }
        if (this.state.animating && !this.state.animPaused) {
            this.pauseAnimation();
            this.runAnimation();
        }
    },

    updateExecutionButtons() {
        const btnRun = document.getElementById("btn-exec-run");
        const btnPause = document.getElementById("btn-exec-pause");
        const statusPill = document.getElementById("circuit-status-text");
        const statusDot = document.getElementById("circuit-status-dot");

        if (this.state.animating && !this.state.animPaused) {
            if (btnRun) btnRun.disabled = true;
            if (btnPause) btnPause.disabled = false;
            if (statusPill) statusPill.textContent = `Evaluating Stage ${this.state.animStep} of 6`;
            if (statusDot) statusDot.className = "status-dot animating";
        } else if (this.state.animPaused) {
            if (btnRun) {
                btnRun.disabled = false;
                btnRun.textContent = "Resume";
            }
            if (btnPause) btnPause.disabled = true;
            if (statusPill) statusPill.textContent = `Paused at Stage ${this.state.animStep}`;
            if (statusDot) statusDot.className = "status-dot paused";
        } else {
            if (btnRun) {
                btnRun.disabled = false;
                btnRun.textContent = "Run Simulation";
            }
            if (btnPause) btnPause.disabled = true;
            if (statusPill) statusPill.textContent = "Circuit Ready";
            if (statusDot) statusDot.className = "status-dot";
        }
    },

    // ==========================================
    // MASTER UI SYNCHRONIZATION
    // ==========================================

    updateSimulationUI() {
        const { simA, simB, simS1, simS0, animStep } = this.state;
        const sim = CircuitSimulator.performOperation(simA, simB, simS1, simS0);

        // 1. Update Physical Selection Switches (S1, S0)
        const btnS1 = document.getElementById("switch-s1-btn");
        const btnS0 = document.getElementById("switch-s0-btn");
        if (btnS1) {
            btnS1.textContent = simS1;
            btnS1.classList.toggle("active-1", simS1 === 1);
        }
        if (btnS0) {
            btnS0.textContent = simS0;
            btnS0.classList.toggle("active-1", simS0 === 1);
        }

        // Active operation title
        const opNameEl = document.getElementById("active-operation-name");
        if (opNameEl) opNameEl.textContent = sim.operation.toUpperCase();

        // 2. Update Operation Table row highlights
        document.querySelectorAll(".op-table-row").forEach(r => {
            const rS1 = parseInt(r.dataset.s1, 10);
            const rS0 = parseInt(r.dataset.s0, 10);
            r.classList.toggle("active-op", rS1 === simS1 && rS0 === simS0);
        });

        // 3. Update Operand A Switches and Inputs
        for (let i = 0; i < 4; i++) {
            const bit = (simA >> i) & 1;
            const btn = document.getElementById(`sim-a-bit-${i}`);
            if (btn) {
                btn.textContent = bit;
                btn.classList.toggle("active-1", bit === 1);
            }
        }
        const decA = document.getElementById("sim-a-dec-input");
        const sliderA = document.getElementById("sim-a-slider");
        const readoutA = document.getElementById("sim-a-readout");
        if (decA) decA.value = simA;
        if (sliderA) sliderA.value = simA;
        if (readoutA) readoutA.textContent = `${simA} (${CircuitSimulator.toBinary4(simA)})`;

        // 4. Update Operand B Switches and Inputs
        const isBRelevant = (simS1 !== 1);
        const cardB = document.getElementById("operand-b-card");
        const noticeB = document.getElementById("operand-b-notice");
        if (cardB) cardB.classList.toggle("disabled", !isBRelevant);
        if (noticeB) {
            noticeB.textContent = isBRelevant 
                ? "Active operand B" 
                : `B is bypassed for ${sim.operation} (MUX forces ${sim.y === 0 ? '0000' : '1111'})`;
        }

        for (let i = 0; i < 4; i++) {
            const bit = (simB >> i) & 1;
            const btn = document.getElementById(`sim-b-bit-${i}`);
            if (btn) {
                btn.textContent = bit;
                btn.classList.toggle("active-1", bit === 1);
            }
        }
        const decB = document.getElementById("sim-b-dec-input");
        const sliderB = document.getElementById("sim-b-slider");
        const readoutB = document.getElementById("sim-b-readout");
        if (decB) decB.value = simB;
        if (sliderB) sliderB.value = simB;
        if (readoutB) readoutB.textContent = `${simB} (${CircuitSimulator.toBinary4(simB)})`;

        // 5. Update Pipeline Tracker Nodes
        for (let step = 1; step <= 6; step++) {
            const node = document.getElementById(`pipe-node-${step}`);
            if (node) {
                const isCurrent = animStep === step;
                const isDone = animStep === 0 || (animStep > step);
                node.classList.toggle("active-now", isCurrent);
                node.classList.toggle("done", isDone && !isCurrent);
            }
        }

        // 6. Render Full Gate-Level SVG Schematic
        CircuitDiagrams.renderGateLevelCircuit("main-circuit-svg-container", sim, animStep);

        // 7. Update Bottom Results Panel
        const isSettled = (animStep === 0 || animStep >= 6);

        for (let i = 0; i < 4; i++) {
            const bit = (sim.result >> i) & 1;
            const cell = document.getElementById(`res-bit-s${i}`);
            if (cell) {
                cell.textContent = isSettled ? bit : '-';
                cell.classList.toggle("is-high", isSettled && bit === 1);
            }
        }

        const coutCell = document.getElementById("res-bit-cout");
        if (coutCell) {
            coutCell.textContent = isSettled ? sim.carryOut : '-';
            coutCell.classList.toggle("is-high", isSettled && sim.carryOut === 1);
        }

        const decTotal = document.getElementById("res-dec-total");
        if (decTotal) {
            decTotal.textContent = isSettled ? sim.result : '--';
        }

        // Subtraction Borrow Explanation
        const subCard = document.getElementById("subtraction-borrow-card");
        if (subCard) {
            if (sim.operation === "Subtraction" && isSettled) {
                subCard.classList.remove("hidden");
                const diffEl = document.getElementById("sub-diff-val");
                const borrowEl = document.getElementById("sub-borrow-val");
                if (diffEl) diffEl.textContent = sim.signedDiff;
                if (borrowEl) {
                    if (sim.borrowOccurred) {
                        borrowEl.textContent = "1 (Borrow occurred: A < B)";
                        borrowEl.style.color = "#DC5555";
                    } else {
                        borrowEl.textContent = "0 (No borrow: A >= B)";
                        borrowEl.style.color = "#16865B";
                    }
                }
            } else {
                subCard.classList.add("hidden");
            }
        }

        // Status Flags
        const flagC = document.getElementById("flag-lamp-c");
        const flagV = document.getElementById("flag-lamp-v");
        const flagZ = document.getElementById("flag-lamp-z");
        const flagS = document.getElementById("flag-lamp-s");

        if (flagC) flagC.textContent = isSettled ? sim.carryOut : '-';
        if (flagV) flagV.textContent = isSettled ? (sim.overflow ? '1' : '0') : '-';
        if (flagZ) flagZ.textContent = isSettled ? (sim.result === 0 ? '1' : '0') : '-';
        if (flagS) flagS.textContent = isSettled ? (((sim.result >> 3) & 1) ? '1' : '0') : '-';

        // Stage Breakdown Table in Results Section
        sim.stages.forEach(stg => {
            const i = stg.stage;
            const elA = document.getElementById(`tbl-a-${i}`);
            const elY = document.getElementById(`tbl-y-${i}`);
            const elCin = document.getElementById(`tbl-cin-${i}`);
            const elP = document.getElementById(`tbl-p-${i}`);
            const elG = document.getElementById(`tbl-g-${i}`);
            const elSum = document.getElementById(`tbl-sum-${i}`);
            const elCout = document.getElementById(`tbl-cout-${i}`);
            const row = document.getElementById(`tbl-row-${i}`);

            if (elA) elA.textContent = stg.bitA;
            if (elY) elY.textContent = stg.bitY;
            if (elCin) elCin.textContent = stg.cin;
            if (elP) elP.textContent = stg.p;
            if (elG) elG.textContent = stg.g;
            if (elSum) elSum.textContent = stg.sum;
            if (elCout) elCout.textContent = stg.cout;

            if (row) {
                row.classList.toggle("active-stage", animStep === (i + 2));
            }
        });

        // Mathematical Verification Narrative
        const formulaEl = document.getElementById("narrative-formula");
        const descEl = document.getElementById("narrative-text");
        if (formulaEl) {
            formulaEl.textContent = `Total = A + Y + Cin = ${simA} + ${sim.y} + ${sim.cin} = ${sim.totalSumDecimal} | S[3:0] = ${sim.result} (Cout = ${sim.carryOut})`;
        }
        if (descEl) {
            let desc = `For ${sim.operation} with selection lines S1=${simS1}, S0=${simS0}: `;
            if (sim.operation === "Addition") {
                desc += `The second-operand MUX selects Y = B (${CircuitSimulator.toBinary4(simB)}), and the carry-in MUX selects Cin = 0. The Ripple Carry Adder computes A + B + 0 = ${simA} + ${simB} + 0 = ${sim.totalSumDecimal}.`;
            } else if (sim.operation === "Subtraction") {
                desc += `The second-operand MUX selects bitwise inverted B (B̅ = ${CircuitSimulator.toBinary4(sim.y)}), and the carry-in MUX selects Cin = 1. The adder computes A + B̅ + 1 = ${simA} + ${sim.y} + 1 = ${sim.totalSumDecimal} (two's complement subtraction). `;
                desc += sim.carryOut === 1 ? `Carry-Out = 1 confirms no borrow occurred (A >= B).` : `Carry-Out = 0 indicates a borrow occurred (A < B). Signed difference = ${sim.signedDiff}.`;
            } else if (sim.operation === "Increment") {
                desc += `The second-operand MUX selects Y = 0000 (constant zero), and the carry-in MUX selects Cin = 1. The adder computes A + 0000 + 1 = ${simA} + 1 = ${sim.totalSumDecimal}.`;
            } else {
                desc += `The second-operand MUX selects Y = 1111 (constant 15, representing -1 in 4-bit two's complement), and the carry-in MUX selects Cin = 0. The adder computes A + 1111 + 0 = ${simA} - 1 = ${sim.totalSumDecimal}.`;
            }
            descEl.textContent = desc;
        }
    },

    // ==========================================
    // 1,024 AUTOMATED TEST SUITE RUNNER
    // ==========================================

    runAutomatedTests(playSound = true) {
        const testRes = CircuitSimulator.runAllTests();
        const badge = document.getElementById("test-grand-status-badge");
        const list = document.getElementById("test-operations-list");

        if (badge) {
            badge.textContent = testRes.allPassed 
                ? `100% PASSED (${testRes.grandTotalPassed} / ${testRes.grandTotalTests} TESTS)` 
                : `FAILURES DETECTED`;
            badge.style.color = testRes.allPassed ? "#16865B" : "#DC5555";
        }

        if (list) {
            list.innerHTML = testRes.operations.map(op => `
                <div style="display: flex; justify-content: space-between; padding: 0.35rem 0.6rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.72rem;">
                    <span><strong>${op.operation}</strong> (S1=${op.s1}, S0=${op.s0})</span>
                    <span style="color: var(--active-high);">${op.passed} / ${op.total} Passed</span>
                    <span style="font-weight: 700; color: var(--active-high);">${op.status}</span>
                </div>
            `).join('');
        }

        if (playSound) {
            this.playClick(1000);
        }
    },

    // ==========================================
    // CODE VIEWER
    // ==========================================

    renderFilePreview(filename) {
        this.state.activeCodeFile = filename;
        const file = this.repoFiles[filename];
        if (!file) return;

        document.querySelectorAll(".code-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.file === filename);
        });

        const titleEl = document.getElementById("code-view-title");
        const descEl = document.getElementById("code-view-desc");
        const codeEl = document.getElementById("code-view-pre");

        if (titleEl) titleEl.textContent = file.title;
        if (descEl) descEl.textContent = file.purpose;
        if (codeEl) codeEl.textContent = file.code;
    },

    setupKeyboardShortcuts() {
        window.addEventListener("keydown", (e) => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

            if (e.key === " " || e.code === "Space") {
                e.preventDefault();
                if (this.state.animating && !this.state.animPaused) {
                    this.pauseAnimation();
                } else {
                    this.runAnimation();
                }
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                this.stepForward();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                this.stepBackward();
            } else if (e.key.toLowerCase() === "r") {
                this.resetCircuit();
            }
        });
    }
};

// Auto-boot safely
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => App.init());
} else {
    App.init();
}
