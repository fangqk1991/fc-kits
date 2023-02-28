import React, { useContext, useEffect, useState } from 'react'
import { SessionHTTP, SessionUserInfo } from './SessionHTTP'

interface Context {
  userInfo: SessionUserInfo
  reloadUserInfo: () => void
}

const VisitorContext = React.createContext<Context>(null as any)

export const useVisitorCtx = () => {
  return useContext(VisitorContext)
}

export const VisitorProvider = ({ children }: React.ComponentProps<any>) => {
  const [userInfo, setUserInfo] = useState({
    email: '',
  } as SessionUserInfo)

  const visitorCtx: Context = {
    userInfo: userInfo,
    reloadUserInfo: () => {
      SessionHTTP.getUserInfo().then((info) => {
        setUserInfo(info)
      })
    },
  }
  useEffect(() => {
    visitorCtx.reloadUserInfo()
  }, [])

  return <VisitorContext.Provider value={visitorCtx}>{children}</VisitorContext.Provider>
}
