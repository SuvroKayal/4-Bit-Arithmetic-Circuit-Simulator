# 4-Bit Arithmetic Circuit Simulator

A Python-based simulation of a **4-bit Arithmetic Circuit** that performs four fundamental arithmetic operations: Addition, Subtraction, Increment, and Decrement.

The project demonstrates the working principles of a 4-bit Full Adder, Multiplexer (MUX), and Control Lines using simple Python programming.

---

## 1. Project Overview

The objective of this project is to design and simulate a 4-bit arithmetic circuit using a common adder architecture.

The circuit performs four operations:

- Addition (A + B)
- Subtraction (A - B)
- Increment (A + 1)
- Decrement (A - 1)

Two selection bits (S1 and S0) control the operation. A multiplexer selects the appropriate second operand (Y) and Carry-In (Cin), which are then supplied to the 4-bit Full Adder.

The final output consists of a 4-bit binary result and a Carry-Out bit.

## 2. Project Objectives

- Understand the working principle of a 4-bit Full Adder.
- Implement arithmetic operations using a common adder.
- Understand Multiplexer (MUX) selection logic.
- Use control lines to select different arithmetic operations.
- Implement binary addition using Boolean logic.
- Understand two's complement subtraction.
- Verify the circuit using different binary inputs.

## 3. Hardware Logic and Selection Table

The arithmetic circuit follows this general equation:

**Total = A + Y + Cin**

The selection lines determine the values of Y and Cin.

| S1 | S0 | Y (Second Operand) | Cin | Operation |
|:---:|:---:|:---:|:---:|---|
| 0 | 0 | B | 0 | Addition |
| 0 | 1 | B̅ | 1 | Subtraction |
| 1 | 0 | 0000 | 1 | Increment |
| 1 | 1 | 1111 | 0 | Decrement |

### Mathematical Operations

**1. Addition**

A + B

**2. Subtraction**

A - B = A + B̅ + 1

Subtraction is performed using two's complement.

**3. Increment**

A + 1 = A + 0000 + 1

**4. Decrement**

A - 1 = A + 1111 + 0

Here, 1111 represents -1 in 4-bit two's complement.

## 4. Project Architecture

The project is divided into five Python files.

```text
4-Bit-Arithmetic-Circuit-Simulator/
│
├── index.html              # Modern, interactive educational website
├── styles.css              # Dark digital electronics / engineering design system
├── simulator.js            # Core JavaScript circuit simulation & test engine
├── circuit_diagrams.js     # Technically accurate interactive SVG schematic renderer
├── app.js                  # UI controllers, presentation mode, stepper, sound
├── server.py               # Lightweight local web server & runner
│
├── main.py                 # Original Python CLI controller
├── multiplexer.py          # Python Multiplexer & carry-in logic
├── full_adder.py           # Python 1-bit and 4-bit Ripple Carry Adder
├── arithmetic_circuit.py   # Python top-level arithmetic circuit orchestrator
└── test_circuit.py         # Python 1,024 automated verification test suite
```

### File Descriptions

| File | Description |
|---|---|
| `index.html` | Interactive web dashboard featuring circuit diagrams first, live simulator, truth tables, and theory. |
| `styles.css` | Professional engineering dark theme with glowing PCB traces, responsive layout, and projector mode. |
| `simulator.js` | Direct port of the Python circuit logic for client-side execution, signal tracing, and 1,024 tests. |
| `circuit_diagrams.js` | Interactive IEEE-standard SVG circuit diagrams with dynamic high/low logic wire illumination. |
| `app.js` | UI logic, slide-deck presentation mode, step-by-step carry propagation animator, and Web Audio API. |
| `server.py` | Local web server (`http://localhost:8000`) and unified runner. |
| `main.py` | Original CLI controller that handles terminal user input, menu selection, and formatted output display. |
| `multiplexer.py` | Selects the second operand Y and Carry-In according to S1 and S0. |
| `full_adder.py` | Implements 1-bit Full Adder logic and connects four stages to create a 4-bit adder. |
| `arithmetic_circuit.py` | Connects the multiplexer and 4-bit Full Adder to perform the selected operation. |
| `test_circuit.py` | Tests all four arithmetic operations using all 1,024 input combinations. |

## 5. Working Principle

The project follows these steps:

1. The user selects an arithmetic operation from the main menu.
2. The program accepts the required 4-bit input values.
3. The selection lines S1 and S0 are assigned according to the selected operation.
4. The Multiplexer selects the appropriate Y and Cin values.
5. The 4-bit Full Adder performs the binary addition.
6. The circuit generates a 4-bit result and Carry-Out.
7. The program displays the binary and decimal results.

### Full Adder Logic

The 1-bit Full Adder uses three inputs:

- A – First input bit.
- B – Second input bit.
- Cin – Carry input.

It generates two outputs:

- Sum – Result bit.
- Cout – Carry output.

**Boolean Expressions:**

Sum:

`Sum = A XOR B XOR Cin`

Carry:

`Cout = (A AND B) OR (Cin AND (A XOR B))`

Four Full Adder stages are connected in series to construct a 4-bit Ripple Carry Adder.

The carry generated by one stage is passed to the next stage.

## 6. Requirements

To run this project, you need:

- Python 3.x
- Visual Studio Code (or any Python-supported IDE)
- A terminal or command prompt

**External Python libraries:** None required.

The project uses built-in Python functionality.

## 7. Installation and Execution

### Step 1: Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

Alternatively, download the project ZIP file and extract it.

### Step 2: Open the Project Folder

```bash
cd arithmetic_simulator
```

### Step 3: Run the Main Program

```bash
python main.py
```

### Step 4: Run the Test Suite

```bash
python test_circuit.py
```

### Step 5: Launch the Interactive Web Dashboard

To launch the modern educational website with interactive circuit diagrams and simulation:

```bash
python server.py
```

Or simply open `index.html` in any web browser (Chrome, Firefox, Edge, Safari) — no external dependencies or installations required!

To present in front of your professor:
- Click **"▶ Presentation Mode"** or press Space/Arrow keys for the fullscreen projector slide deck.
- Toggle **"📽️ Projector Mode"** for high-contrast presentation environments.
- Toggle **"⚡ Run 1,024 Automated Tests"** to display real-time verification in the browser.

## 8. Sample Execution

Example: Addition of A = 5 and B = 3.

```text
==================================================
       4-BIT ARITHMETIC CIRCUIT SIMULATOR
==================================================

Select an Operation:
1. Addition
2. Subtraction
3. Increment
4. Decrement
5. Exit

Enter your choice: 1

Enter value of A (0-15): 5
Enter value of B (0-15): 3

--------------------------------------------------
          CALCULATION RESULT
--------------------------------------------------

Operation : Addition
Control S1 : 0
Control S0 : 0

Operand A  : 0101
Operand B  : 0011

Selected Y : 0011
Carry In   : 0

--------------------------------------------------

Binary Result  : 1000
Decimal Result : 8
Carry Out      : 0

--------------------------------------------------
```

## 9. Testing and Verification

The project includes an automated testing module named `test_circuit.py`.

It verifies the arithmetic operations using all possible combinations of 4-bit inputs.

| Operation | Number of Tests |
|---|---:|
| Addition | 256 |
| Subtraction | 256 |
| Increment | 256 |
| Decrement | 256 |
| **Total** | **1,024** |

Each test checks whether the calculated 4-bit result matches the expected arithmetic result and whether the carry output is correct.

To execute the tests:

```bash
python test_circuit.py
```

## 10. Important Concepts Used

| Concept | Purpose |
|---|---|
| Binary Number System | Represents operands and results using 4 bits. |
| Full Adder | Performs binary addition with carry input. |
| Multiplexer | Selects the required second operand. |
| Control Lines | Select the desired arithmetic operation. |
| XOR Gate | Used in Sum calculation. |
| AND Gate | Used in Carry calculation. |
| OR Gate | Combines carry-generation conditions. |
| Two's Complement | Performs binary subtraction. |
| Ripple Carry Adder | Connects four Full Adder stages. |
| Modular Programming | Divides the project into independent files. |

## 11. Limitations

- The simulator supports only 4-bit unsigned input values (0–15).
- Results are restricted to 4 bits.
- Carry-Out is displayed separately.
- Negative subtraction results are represented using 4-bit two's complement.
- The circuit is implemented as a Python software simulation, not a physical hardware circuit.
- The multiplexer is represented using software selection logic rather than physically constructed MUX gates.

## 12. Future Improvements

Possible future enhancements include:

- Graphical User Interface (GUI).
- Visual representation of Full Adder stages.
- Interactive Multiplexer selection.
- Logic gate-level circuit visualization.
- Support for larger bit-width arithmetic circuits.
- Verilog or VHDL hardware implementation.

## 13. Learning Outcomes

Through this project, we demonstrate an understanding of:

- Basic digital arithmetic circuits.
- Binary addition and subtraction.
- Full Adder Boolean equations.
- Multiplexer selection logic.
- Control signal-based operation selection.
- Ripple Carry Adder architecture.
- Python functions and modular programming.
- Automated testing and verification.

## 14. Conclusion

The 4-Bit Arithmetic Circuit Simulator demonstrates how four fundamental arithmetic operations can be performed using a common adder architecture.

By combining Multiplexer selection logic, control lines, and a 4-bit Ripple Carry Adder, the project simulates Addition, Subtraction, Increment, and Decrement operations.

It provides a practical understanding of digital arithmetic circuit concepts through Python programming.

---

**Project:** 4-Bit Arithmetic Circuit Simulator  
**Language:** Python  
**Domain:** Computer Organization and Architecture  
**Architecture:** Multiplexer + 4-bit Ripple Carry Adder  
**Verification:** 1,024 Test Cases
