import React from 'react'
import WorkLayout from '../../../components/WorkLayout'
import Mark from './Mark';
import AttendanceList from './AttendanceList';
function WorkerDash() {

  

  return (
    <div>
      <WorkLayout>
        <Mark/>
        <AttendanceList/>
      </WorkLayout>
    </div>
  )
}

export default WorkerDash
