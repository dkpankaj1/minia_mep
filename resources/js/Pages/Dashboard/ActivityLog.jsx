import React from 'react'
import { usePermission } from '../../composable/usePermission'

function ActivityLog({ logs }) {
    const { hasRole } = usePermission()
    return hasRole('super_admin') && (
        <div className="card">
            <div className="card-header align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">Recent Activity</h4>
            </div>
            <div className="card-body px-0" style={{ maxHeight: "353px", overflowY: "scroll" }}>
                <div className="px-3">
                    <ul className="list-unstyled activity-wid mb-0">

                        {
                            logs.map((item, index) => {
                                return <li key={index} className="activity-list activity-border">

                                    <div className="activity-icon avatar-md">
                                        {
                                            item.type == "local.ERROR"
                                                ? <span className="avatar-title bg-danger-subtle text-danger rounded-circle">
                                                    <i className="bx bx-error font-size-24"></i>
                                                </span>
                                                : <span className="avatar-title bg-warning-subtle text-warning rounded-circle">
                                                    <i className="bx bx-info-circle font-size-24"></i>
                                                </span>
                                        }
                                    </div>


                                    <div className="timeline-list-item">
                                        <div className="d-flex">
                                            <div className="flex-grow-1 overflow-hidden me-4">
                                                <h5 className="font-size-14 mb-1">{item.date}</h5>
                                                <p className="text-truncate text-muted font-size-13">{item.message}</p>
                                            </div>
                                            <div className="flex-shrink-0 text-end me-3">
                                                <h6 className="mb-1">{item.type}</h6>
                                            </div>
                                        </div>
                                    </div>

                                </li>

                            })
                        }

                    </ul>
                </div>
            </div>

        </div>
    )
}

export default ActivityLog