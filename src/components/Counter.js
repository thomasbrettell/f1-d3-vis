import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <>
      <h2>{count}</h2>
      <button onClick={() => setCount(count + 1)}>click me!</button>
    </>
  );
};

export default Counter;
