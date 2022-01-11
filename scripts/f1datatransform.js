const fs = require('fs');
const data = require('./f1data.json');

const finalOutput = {
  nodes: [],
  links: [],
};
console.log(data);

data.seasons.forEach((sdata) => {
  sdata.drivers.forEach((driver) => {
    const found = finalOutput.nodes.find((d) => d.id === driver);

    if (!found) {
      finalOutput.nodes.push({
        id: driver,
        group: sdata.year[2],
      });
    }

    for (const otherDriver of sdata.drivers) {
      if (otherDriver === driver) continue;
      // const existingLinkI = finalOutput.links.findIndex(
      //   (dp) =>
      //     (dp.source === driver || dp.source === otherDriver) &&
      //     (dp.target === driver || dp.target === otherDriver)
      // );
      const source1 = finalOutput.links.findIndex(
        (dp) => dp.source === driver && dp.target === otherDriver
      );
      const target1 = finalOutput.links.findIndex(
        (dp) => dp.target === driver && dp.source === otherDriver
      );

      if (source1 >= 0) {
        finalOutput.links[source1].value++;
      } else if (source1 < 0 && target1 < 0) {
        finalOutput.links.push({
          source: driver,
          target: otherDriver,
          value: 1,
        });
      }
    }
  });
});

fs.writeFile(
  'f1-data-transformed.json',
  JSON.stringify(finalOutput),
  'utf8',
  () => {}
);
