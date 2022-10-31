import "./App.css";
import { useReducer } from "react";
import DigitButton from "./components/Digitbutton";
import OperationButton from "./components/OperationButton";

export const actions = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case actions.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case actions.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.prevOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.prevOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: `${state.currentOperand}`,
          currentOperand: null,
        };
      }

      return {
        ...state,
        prevOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case actions.CLEAR:
      return {};

    case actions.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }

      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case actions.EVALUATE:
      if (
        state.operation == null ||
        state.prevOperand == null ||
        state.currentOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        prevOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
  }
};

function evaluate({ prevOperand, currentOperand, operation }) {
  const prev = parseFloat(prevOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "/":
      computation = prev / curr;
      break;
  }
  return computation.toString();
}

const INTERGER_FORMATER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [interger, decimal] = operand.split(".");
  if (decimal == null) return INTERGER_FORMATER.format(interger);
  return `${INTERGER_FORMATER.format(interger)}.${decimal}`;
}

function App() {
  const [{ currentOperand, prevOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <section className="calculator_grid">
      <div className="output">
        <div className="previous_operand">
          {formatOperand(prevOperand)}
          {operation}
        </div>
        <div className="current_operand">{formatOperand(currentOperand)}</div>
      </div>

      <button
        className="span-two"
        onClick={() => {
          dispatch({ type: actions.CLEAR });
        }}
      >
        AC
      </button>
      <button
        onClick={() => {
          dispatch({ type: actions.DELETE_DIGIT });
        }}
      >
        DEL
      </button>
      <OperationButton dispatch={dispatch} operation="/" />
      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />
      {/* <button>2</button>
      <button>3</button> */}
      <OperationButton dispatch={dispatch} operation="*" />

      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />
      {/* <button>4</button>
      <button>5</button>
      <button>6</button> */}
      {/* <button>+</button> */}
      <OperationButton dispatch={dispatch} operation="+" />

      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />
      {/* <button>7</button>
      <button>8</button>
      <button>9</button> */}
      {/* <button>-</button> */}
      <OperationButton dispatch={dispatch} operation="-" />

      <DigitButton dispatch={dispatch} digit="." />
      {/* <button>.</button> */}
      <DigitButton dispatch={dispatch} digit="0" />
      {/* <button>0</button> */}
      <button
        className="span-two"
        onClick={() => {
          dispatch({ type: actions.EVALUATE });
        }}
      >
        =
      </button>
    </section>
  );
}

export default App;
