import { Finding, HandleTransaction, TransactionEvent } from "forta-agent";
import agent from "./priceUpdateCheck";

import { TestTransactionEvent } from "@nethermindeth/general-agents-module";

const lessThanTenMinutes = 1467021981; // "Mon, 27 Jun 2016 10:06:21 GMT"
const lessThanTenMinutes2 = 1467022181; // "Mon, 27 Jun 2016 10:09:41 GMT"
const greaterThanTenMinures = 1467022981; // "Mon, 27 Jun 2016 10:23:01 GMT"
const differentHour = 1467032181000; // "Mon, 27 Jun 2016 12:56:21 GMT"

describe("Poker Method", () => {
  let handleTransaction: HandleTransaction;

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  it("No response if different protocol", async () => {
    const txEvent = new TestTransactionEvent().addInvolvedAddress(
      "0x2417c2762ec12f2696f62cfa5492953b9467dc81"
    );

    txEvent.block.timestamp = 0;
    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("Time < 10min, nothing returned, first time function call: sets status to true", async () => {
    const txEvent = new TestTransactionEvent().addInvolvedAddress(
      "0x2417c2762ec12f2696f62cfa5492953b9467dc81"
    );
    txEvent.block.timestamp = lessThanTenMinutes;

    let findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([]);
  });

  it("getStatus after time has lasped > 10 min and the status is true", async () => {
    const txEvent = new TestTransactionEvent().addInvolvedAddress(
      "0x2417c2762ec12f2696f62cfa5492953b9467dc81"
    );
    txEvent.block.timestamp = greaterThanTenMinures; // 19 minutes hour - 19

    const findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([]);
  });

  it("getStatus after time has lasped > 10 min and the status is set to false due to hour change", async () => {
    const txEvent = new TestTransactionEvent().addInvolvedAddress(
      "0x2417c2762ec12f2696f62cfa5492953b9467dc81"
    );
    txEvent.block.timestamp = 1470452581; // hour - 9 minutes - 26

    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);

    // expect(findings).toStrictEqual([
    //   Finding.fromObject({
    //     alertId: "MakerDAO-OSM-4",
    //     description: "Poke() function not called within 10 minutes of the hour",
    //     name: "Method not called within the first 10 minutes",
    //     severity: 5,
    //     type: 0,
    //   }),
    // ]);
  });

  // it("if the hour changes and the call is not make at all, throw an alert", async () => {
  //   const txEvent = new TestTransactionEvent().addInvolvedAddress(
  //     "0x2417c2762ec12f2696f62cfa5492953b9467dc81"
  //   );
  //   txEvent.block.timestamp = 1465332581; // hour - 9 minutes - 26

  //   const findings = await handleTransaction(txEvent);

  //   // console.log(findings, [
  //   //   Finding.fromObject({
  //   //     alertId: "MakerDAO-OSM-4",
  //   //     description: "Poke() function not called within 10 minutes of the hour",
  //   //     name: "Method not called within the first 10 minutes",
  //   //     severity: 5,
  //   //     type: 0,
  //   //   }),
  //   // ]);
  //   expect(findings).toStrictEqual([
  //     Finding.fromObject({
  //       alertId: "MakerDAO-OSM-4",
  //       description: "Poke() function not called within 10 minutes of the hour",
  //       name: "Method not called within the first 10 minutes",
  //       severity: 5,
  //       type: 0,
  //     }),
  //   ]);
  // });
});
