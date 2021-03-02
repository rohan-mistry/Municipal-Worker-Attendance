import React from 'react'
import Layout from '../../../components/Layout'
import PaperSurf from '../../../components/PaperSurf'
import WorkerAttendance from './WorkerAttendance'

function Dashboard() {
  return (
    <div>
      <Layout>
        <WorkerAttendance/>
      </Layout>
      
    </div>
  )
}

export default Dashboard
