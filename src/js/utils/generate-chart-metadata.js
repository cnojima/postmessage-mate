let y = 100;

const nextY = () => {
  return y += 100;
}


/**
 * Generates or updates a `node` for react-flow-chart:
 * node1: {
      id: "node1",
      type: "input-output",
      position: { x: 300, y: 100 },
      ports: {
        port1: {
          id: "port1",
          type: "output",
          properties: {
            value: "yes"
          }
        },
        port2: {
          id: "port2",
          type: "output",
          properties: {
            value: "no"
          }
        }
      }
    },
 * @param {!object} msg 
 */
const setNode = (msg, meta) => {
  const node = meta.nodes[msg.to] || {
    id: msg.to,
    type: 'input-output',
    position: { y: nextY(), x: 100 },
    ports: {
      id: `${msg.to}_port`,
      type: 'output',
    }
  };

  meta[msg.to] = node;
}


export default messages => {
  const ret = {
    offset: { x: 0, y: 0 },
    nodes: {},
    links: {},
    selected: {},
    hovered: {},
  };

  while(messages.length > 0) {
    const msg = messages.shift();
    setNode(msg, ret);
  }

  return ret;
}
