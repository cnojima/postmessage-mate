import React from 'react';
import { FlowChartWithState } from "@mrblenny/react-flow-chart";
import { usePostMessages } from 'hooks';
import { generateChartMeta } from 'utils';

export default () => {
  const messages = usePostMessages();

  console.log('messages @ FlowChart', messages);
  const chartMeta = generateChartMeta(messages);

  return <FlowChartWithState initialValue={chartMeta} />
}
