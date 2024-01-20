import { validateDLPC } from '../src/index';
import { DlpcDocument, DLPCValidationResult } from '../src/types';

describe('DLPC module', () => {
  test('Validate DLPC amount',  () => {
    const dlpc: DlpcDocument = {
      amount: 100.00,
      currency: 'USD',
      dlpcid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      originatorid: '72941929b3225630b718d016ab947649cccf0252',
      referenceid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      committee: '72941929b3225630b718d016ab947649cccf0252',
      committer: '72941929b3225630b718d016ab947649cccf0252',
      duedate: '2023-09-13T14:19:35+00:00',
      commitmentdate: '2023-09-13T14:19:35+00:00',
      commitmentstate: 'INITIATED',
      dischargestate: 'OPEN',
      dischargedate: '2023-09-13T14:19:35+00:00',
      applicablerules: 'Name=BAFT_BEST_PRACTICES|Version=VERSION_2.1_DATED_APRIL_2023|URL=https://www.baft.com/dlpc/1234567890'
    }
    let result: DLPCValidationResult = validateDLPC(dlpc)
    expect(result.validation).toBe(true)

    dlpc.amount = 100
    result = validateDLPC(dlpc)
    expect(result.validation).toBe(true)

    dlpc.amount = 10000000000000000000000000.00
    result = validateDLPC(dlpc)
    expect(result.error.amount).not.toBeUndefined()
    expect(result.validation).toBe(false)

    dlpc.amount = 100.00000001
    result = validateDLPC(dlpc)
    expect(result.error.amount).not.toBeUndefined()
    expect(result.validation).toBe(false)
  });

  test('Validate DLPC currency',  () => {
    const dlpc: DlpcDocument = {
      amount: 100.01,
      currency: '',
      dlpcid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      originatorid: '72941929b3225630b718d016ab947649cccf0252',
      referenceid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      committee: '72941929b3225630b718d016ab947649cccf0252',
      committer: '72941929b3225630b718d016ab947649cccf0252',
      duedate: '2023-09-13T14:19:35+00:00',
      commitmentdate: '2023-09-13T14:19:35+00:00',
      commitmentstate: 'INITIATED',
      dischargestate: 'OPEN',
      dischargedate: '2023-09-13T14:19:35+00:00',
      applicablerules: 'Name=BAFT_BEST_PRACTICES|Version=VERSION_2.1_DATED_APRIL_2023|URL=https://www.baft.com/dlpc/1234567890'
    }
    let result: DLPCValidationResult = validateDLPC(dlpc)
    expect(result.error.currency).not.toBeUndefined()
    expect(result.validation).toBe(false)

    dlpc.currency = 'INR'
    result = validateDLPC(dlpc)
    expect(result.validation).toBe(true)

    dlpc.currency = 'USD'
    result = validateDLPC(dlpc)
    expect(result.validation).toBe(true)
  });

  test('Validate DLPC dlpcid',  () => {
    const dlpc: DlpcDocument = {
      amount: 100.01,
      currency: 'USD',
      dlpcid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      originatorid: '72941929b3225630b718d016ab947649cccf0252',
      referenceid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      committee: '72941929b3225630b718d016ab947649cccf0252',
      committer: '72941929b3225630b718d016ab947649cccf0252',
      duedate: '2023-09-13T14:19:35+00:00',
      commitmentdate: '2023-09-13T14:19:35+00:00',
      commitmentstate: 'INITIATED',
      dischargestate: 'OPEN',
      dischargedate: '2023-09-13T14:19:35+00:00',
      applicablerules: 'Name=BAFT_BEST_PRACTICES|Version=VERSION_2.1_DATED_APRIL_2023|URL=https://www.baft.com/dlpc/1234567890'
    }
    let result: DLPCValidationResult = validateDLPC(dlpc)
    expect(result.validation).toBe(true)

    dlpc.dlpcid = ''
    result = validateDLPC(dlpc)
    expect(result.error.dlpcid).not.toBeUndefined()
    expect(result.validation).toBe(false)

    dlpc.dlpcid = '921f15ccc3b7d158e1237bf0d7709c58bf2b47a30'
    result = validateDLPC(dlpc)
    expect(result.error.dlpcid).not.toBeUndefined()
    expect(result.validation).toBe(false)
  });

  test('Validate DLPC originatorid',  () => {
    const dlpc: DlpcDocument = {
      amount: 100.01,
      currency: 'USD',
      dlpcid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      originatorid: '72941929b3225630b718d016ab947649cccf0252',
      referenceid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      committee: '72941929b3225630b718d016ab947649cccf0252',
      committer: '72941929b3225630b718d016ab947649cccf0252',
      duedate: '2023-09-13T14:19:35+00:00',
      commitmentdate: '2023-09-13T14:19:35+00:00',
      commitmentstate: 'INITIATED',
      dischargestate: 'OPEN',
      dischargedate: '2023-09-13T14:19:35+00:00',
      applicablerules: 'Name=BAFT_BEST_PRACTICES|Version=VERSION_2.1_DATED_APRIL_2023|URL=https://www.baft.com/dlpc/1234567890'
    }
    let result: DLPCValidationResult = validateDLPC(dlpc)
    expect(result.validation).toBe(true)

    dlpc.originatorid = ''
    result = validateDLPC(dlpc)
    expect(result.error.originatorid).not.toBeUndefined()
    expect(result.validation).toBe(false)

    dlpc.originatorid = ''
    result = validateDLPC(dlpc)
    expect(result.error.originatorid).not.toBeUndefined()
    expect(result.validation).toBe(false)
  });

  test('Validate DLPC referenceid', () => {
    const dlpc: DlpcDocument = {
      amount: 100.01,
      currency: 'USD',
      dlpcid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      originatorid: '72941929b3225630b718d016ab947649cccf0252',
      committee: '72941929b3225630b718d016ab947649cccf0252',
      committer: '72941929b3225630b718d016ab947649cccf0252',
      duedate: '2023-09-13T14:19:35+00:00',
      commitmentdate: '2023-09-13T14:19:35+00:00',
      commitmentstate: 'INITIATED',
      dischargestate: 'OPEN',
      dischargedate: '2023-09-13T14:19:35+00:00',
      applicablerules: 'Name=BAFT_BEST_PRACTICES|Version=VERSION_2.1_DATED_APRIL_2023|URL=https://www.baft.com/dlpc/1234567890'
    }
    let result: DLPCValidationResult = validateDLPC(dlpc)
    expect(result.validation).toBe(true)

    dlpc.referenceid = '921f15ccc3b7d158e1237bf0d7709c58bf2b4730'
    result = validateDLPC(dlpc)
    expect(result.validation).toBe(true)

    dlpc.commitmentstate = 'EFFECTIVE'
    result = validateDLPC(dlpc)
    expect(result.validation).toBe(true)
  });

  test('Validate DLPC committee', () => {
    const dlpc: DlpcDocument = {
      amount: 100.01,
      currency: 'USD',
      dlpcid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      originatorid: '72941929b3225630b718d016ab947649cccf0252',
      referenceid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      committee: '72941929b3225630b718d016ab947649cccf0252',
      committer: '72941929b3225630b718d016ab947649cccf0252',
      duedate: '2023-09-13T14:19:35+00:00',
      commitmentdate: '2023-09-13T14:19:35+00:00',
      commitmentstate: 'INITIATED',
      dischargestate: 'OPEN',
      dischargedate: '2023-09-13T14:19:35+00:00',
      applicablerules: 'Name=BAFT_BEST_PRACTICES|Version=VERSION_2.1_DATED_APRIL_2023|URL=https://www.baft.com/dlpc/1234567890'
    }
    let result: DLPCValidationResult = validateDLPC(dlpc)
    expect(result.validation).toBe(true)

    dlpc.committee = ''
    result = validateDLPC(dlpc)
    expect(result.error.committee).not.toBeUndefined()
    expect(result.validation).toBe(false)
  });

  test('Validate DLPC committer', () => {
    const dlpc: DlpcDocument = {
      amount: 100.01,
      currency: 'USD',
      dlpcid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      originatorid: '72941929b3225630b718d016ab947649cccf0252',
      referenceid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      committee: '72941929b3225630b718d016ab947649cccf0252',
      committer: '72941929b3225630b718d016ab947649cccf0252',
      duedate: '2023-09-13T14:19:35+00:00',
      commitmentdate: '2023-09-13T14:19:35+00:00',
      commitmentstate: 'INITIATED',
      dischargestate: 'OPEN',
      dischargedate: '2023-09-13T14:19:35+00:00',
      applicablerules: 'Name=BAFT_BEST_PRACTICES|Version=VERSION_2.1_DATED_APRIL_2023|URL=https://www.baft.com/dlpc/1234567890'
    }
    let result: DLPCValidationResult = validateDLPC(dlpc)
    expect(result.validation).toBe(true)

    dlpc.committer = ''
    result = validateDLPC(dlpc)
    expect(result.error.committer).not.toBeUndefined()
    expect(result.validation).toBe(false)
  });

  test('Validate DLPC duedate', () => {
    const dlpc: DlpcDocument = {
      amount: 100.01,
      currency: 'USD',
      dlpcid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      originatorid: '72941929b3225630b718d016ab947649cccf0252',
      referenceid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      committee: '72941929b3225630b718d016ab947649cccf0252',
      committer: '72941929b3225630b718d016ab947649cccf0252',
      duedate: '',
      commitmentdate: '2023-09-13T14:19:35+00:00',
      commitmentstate: 'INITIATED',
      dischargestate: 'OPEN',
      dischargedate: '2023-09-13T14:19:35+00:00',
      applicablerules: 'Name=BAFT_BEST_PRACTICES|Version=VERSION_2.1_DATED_APRIL_2023|URL=https://www.baft.com/dlpc/1234567890'
    }
    let result: DLPCValidationResult = validateDLPC(dlpc)
    expect(result.validation).toBe(true)

    dlpc.duedate = '2023-09-13T14:1+00:00'
    result = validateDLPC(dlpc)
    expect(result.validation).toBe(false)
    expect(result.error.duedate).not.toBeUndefined()

    dlpc.duedate = '2020-04-13T14:19:35+00:00'
    result = validateDLPC(dlpc)
    expect(result.validation).toBe(false)
    expect(result.error.duedate).not.toBeUndefined()
  });

  test('Validate DLPC commitmentdate', () => {
    const dlpc: DlpcDocument = {
      amount: 100.01,
      currency: 'USD',
      dlpcid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      originatorid: '72941929b3225630b718d016ab947649cccf0252',
      referenceid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      committee: '72941929b3225630b718d016ab947649cccf0252',
      committer: '72941929b3225630b718d016ab947649cccf0252',
      duedate: '2023-09-13T14:19:35+00:00',
      commitmentstate: 'INITIATED',
      dischargestate: 'OPEN',
      dischargedate: '2023-09-13T14:19:35+00:00',
      applicablerules: 'Name=BAFT_BEST_PRACTICES|Version=VERSION_2.1_DATED_APRIL_2023|URL=https://www.baft.com/dlpc/1234567890'
    }
    let result: DLPCValidationResult = validateDLPC(dlpc)
    expect(result.validation).toBe(true)

    dlpc.commitmentdate = '2023-09-13T14:19:35+00:00'
    result = validateDLPC(dlpc)
    expect(result.validation).toBe(true)
  
    dlpc.commitmentdate = '2023-09-13T14:1+00:00'
    result = validateDLPC(dlpc)
    expect(result.error.commitmentdate).not.toBeUndefined()
    expect(result.validation).toBe(false)

    dlpc.commitmentdate = '2020-04-13T14:19:35+00:00'
    result = validateDLPC(dlpc)
    expect(result.error.commitmentdate).not.toBeUndefined()
    expect(result.validation).toBe(false)
  });

  test('Validate DLPC commitmentstate', () => {
    const dlpc: DlpcDocument = {
      amount: 100.01,
      currency: 'USD',
      dlpcid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      originatorid: '72941929b3225630b718d016ab947649cccf0252',
      referenceid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      committee: '72941929b3225630b718d016ab947649cccf0252',
      committer: '72941929b3225630b718d016ab947649cccf0252',
      duedate: '2023-09-13T14:19:35+00:00',
      commitmentdate: '2023-09-13T14:19:35+00:00',
      commitmentstate: 'INITIATED',
      dischargestate: 'OPEN',
      dischargedate: '2023-09-13T14:19:35+00:00',
      applicablerules: 'Name=BAFT_BEST_PRACTICES|Version=VERSION_2.1_DATED_APRIL_2023|URL=https://www.baft.com/dlpc/1234567890'
    }
    let result: DLPCValidationResult = validateDLPC(dlpc)
    expect(result.validation).toBe(true)

    dlpc.commitmentstate = 'NOTVALID'
    result = validateDLPC(dlpc)
    expect(result.error.commitmentstate).not.toBeUndefined()
    expect(result.validation).toBe(false)
  });

  test('Validate DLPC dischargestate', () => {
    const dlpc: DlpcDocument = {
      amount: 100.01,
      currency: 'USD',
      dlpcid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      originatorid: '72941929b3225630b718d016ab947649cccf0252',
      referenceid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      committee: '72941929b3225630b718d016ab947649cccf0252',
      committer: '72941929b3225630b718d016ab947649cccf0252',
      duedate: '2023-09-13T14:19:35+00:00',
      commitmentdate: '2023-09-13T14:19:35+00:00',
      commitmentstate: 'INITIATED',
      dischargestate: 'OPEN',
      dischargedate: '2023-09-13T14:19:35+00:00',
      applicablerules: 'Name=BAFT_BEST_PRACTICES|Version=VERSION_2.1_DATED_APRIL_2023|URL=https://www.baft.com/dlpc/1234567890'
    }
    let result: DLPCValidationResult = validateDLPC(dlpc)
    expect(result.validation).toBe(true)

    dlpc.dischargestate = 'NOTVALID'
    result = validateDLPC(dlpc)
    expect(result.error.dischargestate).not.toBeUndefined()
    expect(result.validation).toBe(false)
  });

  test('Validate DLPC applicablerules', () => {
    const dlpc: DlpcDocument = {
      amount: 100.01,
      currency: 'USD',
      dlpcid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      originatorid: '72941929b3225630b718d016ab947649cccf0252',
      referenceid: '921f15ccc3b7d158e1237bf0d7709c58bf2b4730',
      committee: '72941929b3225630b718d016ab947649cccf0252',
      committer: '72941929b3225630b718d016ab947649cccf0252',
      duedate: '2023-09-13T14:19:35+00:00',
      commitmentdate: '2023-09-13T14:19:35+00:00',
      commitmentstate: 'INITIATED',
      dischargestate: 'OPEN',
      dischargedate: '2023-09-13T14:19:35+00:00',
    }
    let result: DLPCValidationResult = validateDLPC(dlpc)
    expect(result.validation).toBe(true)

    dlpc.applicablerules = 'Name=BAFT_BEST_PRACTICES|Version=VERSION_2.1_DATED_APRIL_2023|URL=https://www.baft.com/dlpc/1234567890'
    result = validateDLPC(dlpc)
    expect(result.validation).toBe(true)

    dlpc.applicablerules = 'BAFT_BEST_PRACTICES|Version=VERSION_2.1_DATED_APRIL_2023|URL=https://www.baft.com/dlpc/1234567890'
    result = validateDLPC(dlpc)
    expect(result.validation).toBe(true)

    dlpc.applicablerules = ''
    result = validateDLPC(dlpc)
    expect(result.validation).toBe(true)
  });
});