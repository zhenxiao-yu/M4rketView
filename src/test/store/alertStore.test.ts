import { describe, it, expect, beforeEach } from 'vitest'
import { useAlertStore } from '@/store/alertStore'

const mockAlert = {
  coinId: 'bitcoin',
  coinName: 'Bitcoin',
  coinImage: 'https://example.com/btc.png',
  targetPrice: 50000,
  direction: 'above' as const,
}

describe('alertStore', () => {
  beforeEach(() => {
    useAlertStore.setState({ alerts: [] })
  })

  it('adds an alert with generated id', () => {
    useAlertStore.getState().addAlert(mockAlert)
    const alerts = useAlertStore.getState().alerts
    expect(alerts).toHaveLength(1)
    expect(alerts[0].id).toContain('bitcoin')
    expect(alerts[0].triggered).toBe(false)
  })

  it('removes an alert by id', () => {
    useAlertStore.getState().addAlert(mockAlert)
    const id = useAlertStore.getState().alerts[0].id
    useAlertStore.getState().removeAlert(id)
    expect(useAlertStore.getState().alerts).toHaveLength(0)
  })

  it('marks an alert as triggered', () => {
    useAlertStore.getState().addAlert(mockAlert)
    const id = useAlertStore.getState().alerts[0].id
    useAlertStore.getState().markTriggered(id)
    expect(useAlertStore.getState().alerts[0].triggered).toBe(true)
  })

  it('activeCount returns only non-triggered alerts', () => {
    useAlertStore.getState().addAlert(mockAlert)
    useAlertStore.getState().addAlert({ ...mockAlert, coinId: 'ethereum', coinName: 'Ethereum' })
    const id = useAlertStore.getState().alerts[0].id
    useAlertStore.getState().markTriggered(id)
    expect(useAlertStore.getState().activeCount()).toBe(1)
  })

  it('clearTriggered removes only triggered alerts', () => {
    useAlertStore.getState().addAlert(mockAlert)
    useAlertStore.getState().addAlert({ ...mockAlert, coinId: 'ethereum', coinName: 'Ethereum' })
    const id = useAlertStore.getState().alerts[0].id
    useAlertStore.getState().markTriggered(id)
    useAlertStore.getState().clearTriggered()
    expect(useAlertStore.getState().alerts).toHaveLength(1)
    expect(useAlertStore.getState().alerts[0].coinId).toBe('ethereum')
  })
})
