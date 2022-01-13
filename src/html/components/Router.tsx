import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { CreateAccountScene } from './CreateAccountScene'
import { MainScene } from './MainScene'

export const Router: React.FC<{}> = (): React.ReactElement => {
  return (
    <Routes>
      <Route path="/" element={<MainScene />} />
      <Route path="create-account" element={<CreateAccountScene />} />
    </Routes>
  )
}
