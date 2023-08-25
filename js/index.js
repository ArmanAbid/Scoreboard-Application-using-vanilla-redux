const allMatchEl = document.querySelector(".all-matches");
const addMatchEl = document.querySelector(".add-match-btn");
const resetBtnEl = document.querySelector(".reset-btn");
let matchCount = 1;
//Match template with id
const getMatchHTMLStringWithId = (id) =>
  `<div class="wrapper">
      <button class="lws-delete" id="delete-${id}">
          <img src="./image/delete.svg" alt="" />
      </button>
      <h3 class="lws-matchName match-name" id="match-name-${id}">Match ${id}</h3>
  </div>
  <div class="inc-dec">
      <form class="incrementForm" id="incrementForm-${id}">
          <h4>Increment</h4>
          <input
              type="number"
              name="increment"
              class="lws-increment increment"
              id="increment-${id}"
          />
      </form>
      <form class="decrementForm" id="decrementForm-${id}">
          <h4>Decrement</h4>
          <input
              type="number"
              name="decrement"
              class="lws-decrement decrement"
              id="decrement-${id}"
          />
      </form>
  </div>
  <div class="numbers">
      <h2 class="lws-singleResult result" id="result-${id}"></h2>
  </div>`;

// action identifiers
const INCREMENT = "increment";
const DECREMENT = "decrement";
const ADD_MATCH = "addMatch";
const RESET_MATCH = "resetMatch";
const DELETE_MATCH = "deleteMatch";

// action creators
const increment = (value) => {
  return {
    type: INCREMENT,
    payload: value,
  };
};
const decrement = (value) => {
  return {
    type: DECREMENT,
    payload: value,
  };
};
//Add Match
const addMatch = (value) => {
  return {
    type: ADD_MATCH,
    payload: value,
  };
};

//Reset all counters
const resetMatch = () => {
  return {
    type: RESET_MATCH,
  };
};
//Delete match
const deleteMatch = (value) => {
  return {
    type: DELETE_MATCH,
    payload: value,
  };
};
// initial state
const initialState = {
  matchs: [
    {
      id: 1,
      value: 0,
      defaultValue: 0,
    },
  ],
};
// create reducer function
const matchReducer = (state = initialState, action) => {
  if (action.type === INCREMENT) {
    return {
      ...state,
      matchs: state.matchs.map((match) => {
        if (
          match.id === action.payload.id &&
          action.payload.value &&
          action.payload.value >= 0
        ) {
          return {
            ...match,
            value: match.value + parseInt(action.payload.value),
          };
        } else if (match.id === action.payload.id && !action.payload.value) {
          alert("somthing went wrong");
          return { ...match };
        } else if (match.id === action.payload.id && action.payload.value < 0) {
          alert("somthing went wrong");
          return { ...match };
        } else {
          return { ...match };
        }
      }),
    };
  } else if (action.type === DECREMENT) {
    return {
      ...state,
      matchs: state.matchs.map((match) => {
        if (
          match.id === action.payload.id &&
          action.payload.value &&
          action.payload.value >= 0 &&
          match.value - action.payload.value >= 0
        ) {
          return {
            ...match,
            value: match.value - parseInt(action.payload.value),
          };
        } else if (
          match.id === action.payload.id &&
          match.value - action.payload.value < 0
        ) {
          return {
            ...match,
            value : 0
          }
        } else if (match.id === action.payload.id && !action.payload.value) {
          alert("somthing went wrong");
          return { ...match };
        } else if (match.id === action.payload.id && action.payload.value < 0) {
          alert("somthing went wrong");
          return { ...match };
        } else {
          return { ...match };
        }
      }),
    };
  } else if (action.type === ADD_MATCH) {
    return {
      ...state,
      matchs: [
        ...state.matchs,
        {
          id: action.payload.id ,
          value: action.payload.defaultValue,
          ...action.payload,
        },
      ],
    };
  } else if (action.type === RESET_MATCH) {
    return {
      ...state,
      matchs: state.matchs.map((match) => ({
        ...match,
        value: match.defaultValue,
      })),
    };
  } else if (action.type === DELETE_MATCH) {
    return {
      ...state,
      matchs: state.matchs.filter((match) => match.id !== action.payload.id),
    };
  } else {
    return state;
  }
};

// create store
const store = Redux.createStore(matchReducer);
////
const addMatchRow = (match) => {
  const el = document.createElement("div");
  el.setAttribute("id", `match-${match.id}`);
  el.setAttribute("class", "match");
  el.innerHTML = getMatchHTMLStringWithId(match.id);
  allMatchEl.insertAdjacentElement("beforeend", el);
};
const matchActionHandler = (match) =>{
  const incrementFormEl = document.getElementById(
    `incrementForm-${match.id}`
  );
  const decrementFormEl = document.getElementById(
    `decrementForm-${match.id}`
  );
  const incrementInputEl = document.getElementById(`increment-${match.id}`);
  const decrementInputEl = document.getElementById(`decrement-${match.id}`);

  incrementFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    store.dispatch(
      increment({
        id: match.id,
        value: incrementInputEl.value,
      })
    );
    e.target.reset();
  });
  decrementFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    store.dispatch(
      decrement({
        id: match.id,
        value: decrementInputEl.value,
      })
    );
    e.target.reset();
  });
}
const removeMatchRow = (id) =>{
   const el = document.getElementById(`match-${id}`)
    allMatchEl.removeChild(el)
    if (id===1) {
      matchCount = 0
    }
}
const render = () => {
  const state = store.getState();
  state.matchs.forEach((match) => {
    if (!document.getElementById(`match-${match.id}`)) {
      addMatchRow(match);
      matchActionHandler(match);
    }
    const deleteBtnEl = document.getElementById(`delete-${match.id}`);
    deleteBtnEl.addEventListener("click", () => {
      store.dispatch(
        deleteMatch({
          id: match.id,
        })
      );
      removeMatchRow(match.id)
    });
    const resultEl = document.getElementById(`result-${match.id}`);
    resultEl.innerText = match.value;
  });
};
render();

addMatchEl.addEventListener("click", () => {
  store.dispatch(
    addMatch({
      id : ++matchCount,
      defaultValue: 0,
    })
  );
});
resetBtnEl.addEventListener("click", () => {
  store.dispatch(resetMatch());
});

store.subscribe(render);
