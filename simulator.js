/**
 * 4-Bit Arithmetic Circuit Simulator - Core Logic Engine
 * Matches Python implementation in full_adder.py, multiplexer.py, arithmetic_circuit.py, and test_circuit.py.
 */

const CircuitSimulator = {
    // 1-Bit Full Adder implementation (matches full_adder.py)
    fullAdder(a, b, cin) {
        a = a & 1;
        b = b & 1;
        cin = cin & 1;

        const a_xor_b = a ^ b;
        const a_and_b = a & b;
        const cin_and_prop = cin & a_xor_b;

        const sum = a_xor_b ^ cin;
        const cout = a_and_b | cin_and_prop;

        return {
            sum,
            cout,
            intermediate: {
                a_xor_b,
                a_and_b,
                cin_and_prop
            }
        };
    },

    // 1-Bit Half Adder implementation
    halfAdder(a, b) {
        a = a & 1;
        b = b & 1;
        return {
            sum: a ^ b,
            carry: a & b
        };
    },

    // Multiplexer selection logic (matches multiplexer.py)
    selectInputs(a, b, s1, s0) {
        a = a & 15;
        b = b & 15;
        s1 = s1 & 1;
        s0 = s0 & 1;

        let y = 0;
        let cin = 0;
        let operation = "";
        let formula = "";
        let description = "";

        if (s1 === 0 && s0 === 0) {
            y = b;
            cin = 0;
            operation = "Addition";
            formula = "A + B";
            description = "Direct binary addition: Y receives B directly and Cin is set to 0. Total = A + B + 0.";
        } else if (s1 === 0 && s0 === 1) {
            y = b ^ 15; // 1's complement of B (bitwise NOT for 4 bits)
            cin = 1;    // Adding 1 forms the 2's complement of B
            operation = "Subtraction";
            formula = "A - B = A + B' + 1";
            description = "Two's complement subtraction: Y receives B inverted (B') and Cin is set to 1. Total = A + B' + 1.";
        } else if (s1 === 1 && s0 === 0) {
            y = 0;      // 0000 in binary
            cin = 1;
            operation = "Increment";
            formula = "A + 1";
            description = "Increment operand A by 1: Y is forced to 0000 and Cin is set to 1. Total = A + 0 + 1.";
        } else {
            y = 15;     // 1111 in binary (2's complement representation of -1)
            cin = 0;
            operation = "Decrement";
            formula = "A - 1 = A + 1111(2) + 0";
            description = "Decrement operand A by 1: Y is set to 1111 (-1 in 4-bit 2's complement) and Cin is set to 0. Total = A + 15 + 0.";
        }

        return {
            y,
            cin,
            operation,
            formula,
            description,
            s1,
            s0
        };
    },

    // 4-Bit Ripple Carry Adder (matches full_adder.py)
    fourBitAdder(a, y, cin) {
        a = a & 15;
        y = y & 15;
        cin = cin & 1;

        let result = 0;
        let currentCarry = cin;
        const stages = [];

        for (let i = 0; i < 4; i++) {
            const bitA = (a >> i) & 1;
            const bitY = (y >> i) & 1;

            const stageRes = this.fullAdder(bitA, bitY, currentCarry);

            stages.push({
                stage: i,
                bitA,
                bitY,
                cin: currentCarry,
                sum: stageRes.sum,
                cout: stageRes.cout,
                intermediate: stageRes.intermediate
            });

            result = result | (stageRes.sum << i);
            currentCarry = stageRes.cout;
        }

        return {
            result,
            carryOut: currentCarry,
            stages
        };
    },

    // Master execution function (matches arithmetic_circuit.py)
    performOperation(a, b, s1, s0) {
        a = a & 15;
        b = b & 15;

        const mux = this.selectInputs(a, b, s1, s0);
        const adder = this.fourBitAdder(a, mux.y, mux.cin);

        // Subtraction signed analysis:
        let signedDiff = null;
        let borrowOccurred = false;
        if (s1 === 0 && s0 === 1) {
            signedDiff = a - b;
            // In 2's complement subtraction using adder (A + B' + 1):
            // Cout = 1 means NO borrow (A >= B).
            // Cout = 0 means BORROW occurred (A < B).
            borrowOccurred = adder.carryOut === 0;
        }

        // Two's complement signed interpretation of the 4-bit result:
        // If MSB (bit 3) is 1, signed value is result - 16
        const msb = (adder.result >> 3) & 1;
        const signedInterpretation = msb === 1 ? adder.result - 16 : adder.result;

        // Check for 2's complement signed overflow:
        // Overflow occurs when carry into sign bit != carry out of sign bit
        const cInMSB = adder.stages[2].cout;
        const cOutMSB = adder.stages[3].cout;
        const overflow = (cInMSB ^ cOutMSB) === 1;

        return {
            a,
            b,
            s1: mux.s1,
            s0: mux.s0,
            operation: mux.operation,
            formula: mux.formula,
            description: mux.description,
            y: mux.y,
            cin: mux.cin,
            result: adder.result,
            carryOut: adder.carryOut,
            stages: adder.stages,
            signedDiff,
            borrowOccurred,
            signedInterpretation,
            overflow,
            totalSumDecimal: a + mux.y + mux.cin
        };
    },

    // Run complete 1,024 test suite (matches test_circuit.py)
    runAllTests() {
        const operations = [
            { s1: 0, s0: 0, name: "Addition" },
            { s1: 0, s0: 1, name: "Subtraction" },
            { s1: 1, s0: 0, name: "Increment" },
            { s1: 1, s0: 1, name: "Decrement" }
        ];

        const results = [];
        let grandTotalPassed = 0;
        let grandTotalTests = 0;

        for (const op of operations) {
            let passed = 0;
            let total = 0;
            const failures = [];

            for (let a = 0; a < 16; a++) {
                for (let b = 0; b < 16; b++) {
                    const sim = this.performOperation(a, b, op.s1, op.s0);

                    let expected = 0;
                    if (op.s1 === 0 && op.s0 === 0) expected = a + b;
                    else if (op.s1 === 0 && op.s0 === 1) expected = a - b;
                    else if (op.s1 === 1 && op.s0 === 0) expected = a + 1;
                    else expected = a - 1;

                    const expectedResult = expected & 15;
                    const expectedCarry = (a + sim.y + sim.cin) >> 4;

                    total++;
                    if (sim.result === expectedResult && sim.carryOut === expectedCarry) {
                        passed++;
                    } else {
                        failures.push({
                            a,
                            b,
                            expectedResult,
                            actualResult: sim.result,
                            expectedCarry,
                            actualCarry: sim.carryOut
                        });
                    }
                }
            }

            grandTotalPassed += passed;
            grandTotalTests += total;

            results.push({
                operation: op.name,
                s1: op.s1,
                s0: op.s0,
                passed,
                total,
                status: passed === total ? "PASSED" : "FAILED",
                failures
            });
        }

        return {
            operations: results,
            grandTotalPassed,
            grandTotalTests,
            allPassed: grandTotalPassed === grandTotalTests
        };
    },

    // Helper: Convert number to 4-bit binary string
    toBinary4(num) {
        return (num & 15).toString(2).padStart(4, "0");
    },

    // Helper: Convert number to 1-bit binary string
    toBinary1(num) {
        return (num & 1).toString();
    }
};

// Export for module systems or window
if (typeof module !== "undefined" && module.exports) {
    module.exports = CircuitSimulator;
}
