import { validateEnvelope } from '../src/index';
import { Envelope, EnvelopeValidationResult } from '../src/types';

describe('Envelope module', () => {
  test('Validate Envelope EventName', async () => {
    const envelope: Envelope = {
      EventName: "request_dlpc",
      SenderOrg: "committeeOrg",
      ReceiverOrg: "committerOrg",
      Metadata: "Metadata value",
      ChainId: "tcpdr-kanna-a",
      Port: "fi",
      ChannelID: "channel-1",
      TimeoutTimestamp: "1682531200000000000"
    }

    let result: EnvelopeValidationResult = validateEnvelope(envelope)
    expect(result.validation).toBe(true)

    envelope.EventName = "check_dlpc"
    result = validateEnvelope(envelope)
    expect(result.error.EventName).not.toBeUndefined()
    expect(result.validation).toBe(false)
  });

  test('Validate Envelope SenderOrg', async () => {
    const envelope: Envelope = {
      EventName: "request_dlpc",
      SenderOrg: "committeeOrg",
      ReceiverOrg: "committerOrg",
      Metadata: "Metadata value",
      ChainId: "tcpdr-kanna-a",
      Port: "fi",
      ChannelID: "channel-1",
      TimeoutTimestamp: "1682531200000000000"
    }

    let result: EnvelopeValidationResult = validateEnvelope(envelope)
    expect(result.validation).toBe(true)

    envelope.SenderOrg = 'true'
    result = validateEnvelope(envelope)
    expect(result.validation).toBe(true)
  });

  test('Validate Envelope ReceiverOrg', async () => {
    const envelope: Envelope = {
      EventName: "request_dlpc",
      SenderOrg: "committeeOrg",
      ReceiverOrg: "committerOrg",
      Metadata: "Metadata value",
      ChainId: "tcpdr-kanna-a",
      Port: "fi",
      ChannelID: "channel-1",
      TimeoutTimestamp: "1682531200000000000"
    }

    let result: EnvelopeValidationResult = validateEnvelope(envelope)
    expect(result.validation).toBe(true)

    envelope.ReceiverOrg = 'true'
    result = validateEnvelope(envelope)
    expect(result.validation).toBe(true)
  });

  test('Validate Envelope Metadata', async () => {
    const envelope: Envelope = {
      EventName: "request_dlpc",
      SenderOrg: "committeeOrg",
      ReceiverOrg: "committerOrg",
      Metadata: "Metadata value",
      ChainId: "tcpdr-kanna-a",
      Port: "fi",
      ChannelID: "channel-1",
      TimeoutTimestamp: "1682531200000000000"
    }

    let result: EnvelopeValidationResult = validateEnvelope(envelope)
    expect(result.validation).toBe(true)

    envelope.Metadata = 'true'
    result = validateEnvelope(envelope)
    expect(result.validation).toBe(true)
  });

  test('Validate Envelope ChainId', async () => {
    const envelope: Envelope = {
      EventName: "request_dlpc",
      SenderOrg: "committeeOrg",
      ReceiverOrg: "committerOrg",
      Metadata: "Metadata value",
      ChainId: "tcpdr-kanna-a",
      Port: "fi",
      ChannelID: "channel-1",
      TimeoutTimestamp: "1682531200000000000"
    }

    let result: EnvelopeValidationResult = validateEnvelope(envelope)
    expect(result.validation).toBe(true)

    envelope.ChainId = 'true'
    result = validateEnvelope(envelope)
    expect(result.validation).toBe(true)
  });

  test('Validate Envelope Port', async () => {
    const envelope: Envelope = {
      EventName: "request_dlpc",
      SenderOrg: "committeeOrg",
      ReceiverOrg: "committerOrg",
      Metadata: "Metadata value",
      ChainId: "tcpdr-kanna-a",
      Port: "fi",
      ChannelID: "channel-1",
      TimeoutTimestamp: "1682531200000000000"
    }

    let result: EnvelopeValidationResult = validateEnvelope(envelope)
    expect(result.validation).toBe(true)

    envelope.Port = 'check'
    result = validateEnvelope(envelope)
    expect(result.validation).toBe(false)
  });

  test('Validate Envelope ChannelID', async () => {
    const envelope: Envelope = {
      EventName: "request_dlpc",
      SenderOrg: "committeeOrg",
      ReceiverOrg: "committerOrg",
      Metadata: "Metadata value",
      ChainId: "tcpdr-kanna-a",
      Port: "fi",
      ChannelID: "channel-1",
      TimeoutTimestamp: "1682531200000000000"
    }

    let result: EnvelopeValidationResult = validateEnvelope(envelope)
    expect(result.validation).toBe(true)

    envelope.ChannelID = 'channel-2'
    result = validateEnvelope(envelope)
    expect(result.validation).toBe(true)
  });

  test('Validate Envelope TimeoutTimestamp', async () => {
    const envelope: Envelope = {
      EventName: "request_dlpc",
      SenderOrg: "committeeOrg",
      ReceiverOrg: "committerOrg",
      Metadata: "Metadata value",
      ChainId: "tcpdr-kanna-a",
      Port: "fi",
      ChannelID: "channel-1",
      TimeoutTimestamp: "1682531200000000000"
    }

    let result: EnvelopeValidationResult = validateEnvelope(envelope)
    expect(result.validation).toBe(true)

    envelope.TimeoutTimestamp = "1670307495000000000"
    result = validateEnvelope(envelope)
    expect(result.error.TimeoutTimestamp).not.toBeUndefined()
    expect(result.validation).toBe(false)
  });
});