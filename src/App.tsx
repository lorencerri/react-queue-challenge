import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [item, setItem] = useState<number>(0);
  const [queues, setQueues] = useState<number[][]>([[], [], [], [], []]);

  const addItem = (customItem?: number) => {
    if (!customItem && !item) return;

    const shortestQueueIndex = queues
      .map((q, index) => ({
        sum: q.reduce((prev, cur) => prev + cur, 0),
        index,
      }))
      .sort((a, b) => a.sum - b.sum)[0].index;

    setQueues((queues) => {
      const newQueue = [...queues]; // Copying the array & child ensures it is idempotent
      newQueue[shortestQueueIndex] = [...newQueue[shortestQueueIndex]];
      newQueue[shortestQueueIndex].push(customItem || item);
      return newQueue;
    });

    setItem(0);
  };

  const removeItems = () => {
    console.log(queues);
    setQueues((queues) => {
      const newQueue = [...queues];
      return newQueue.map((items) => {
        const newItems = [...items];
        if (newItems[0] == 1) delete newItems[0];
        else if (newItems[0]) newItems[0] = newItems[0] - 1;
        return newItems.filter(Number);
      });
    });
  };

  const addRandomItem = () => {
    addItem(Math.floor(Math.random() * 30) + 1);
  };

  useEffect(() => {
    const unsubscribe = setInterval(() => {
      removeItems();
    }, 1000);

    return () => {
      clearInterval(unsubscribe);
    };
  }, []);

  return (
    <div className="App">
      <div id="itemContainer">
        <input
          type="number"
          value={item}
          placeholder="Items"
          onChange={(e) => {
            setItem(Number(e.target.value));
          }}
        />
        <button onClick={() => addItem()}>Checkout</button>
        <button onClick={() => addRandomItem()}>Add Random Cart</button>
      </div>
      <div id="checkoutContainer">
        {queues.map((queue) => (
          <div className="queueContainer">
            <div className="checkout itemText">
              {queue.reduce((a, b) => a + b, 0)}
            </div>
            {queue.map((item) => (
              <div className="item itemText">{item}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
