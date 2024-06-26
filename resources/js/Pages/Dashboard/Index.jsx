import React, { lazy, useState } from 'react'
import AuthLayout from '../../Layouts/AuthLayout'

function Index({ logs }) {

  console.log(logs)

  return (
    <AuthLayout>

      <div className="row">
        <div className="col-xl-3 col-md-6">

          <div className="card card-h-100">

            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-6">
                  <span className="text-muted mb-3 lh-1 d-block text-truncate">My Wallet</span>
                  <h4 className="mb-3">
                    $<span className="counter-value" data-target="865.2">0</span>k
                  </h4>
                </div>

                <div className="col-6">
                  <div id="mini-chart1" data-colors='["#5156be"]' className="apex-charts mb-2"></div>
                </div>
              </div>
              <div className="text-nowrap">
                <span className="badge bg-success-subtle text-success">+$20.9k</span>
                <span className="ms-1 text-muted font-size-13">Since last week</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">

          <div className="card card-h-100">

            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-6">
                  <span className="text-muted mb-3 lh-1 d-block text-truncate">Number of Trades</span>
                  <h4 className="mb-3">
                    <span className="counter-value" data-target="6258">0</span>
                  </h4>
                </div>
                <div className="col-6">
                  <div id="mini-chart2" data-colors='["#5156be"]' className="apex-charts mb-2"></div>
                </div>
              </div>
              <div className="text-nowrap">
                <span className="badge bg-danger-subtle text-danger">-29 Trades</span>
                <span className="ms-1 text-muted font-size-13">Since last week</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">

          <div className="card card-h-100">

            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-6">
                  <span className="text-muted mb-3 lh-1 d-block text-truncate">Invested Amount</span>
                  <h4 className="mb-3">
                    $<span className="counter-value" data-target="4.32">0</span>M
                  </h4>
                </div>
                <div className="col-6">
                  <div id="mini-chart3" data-colors='["#5156be"]' className="apex-charts mb-2"></div>
                </div>
              </div>
              <div className="text-nowrap">
                <span className="badge bg-success-subtle text-success">+ $2.8k</span>
                <span className="ms-1 text-muted font-size-13">Since last week</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">

          <div className="card card-h-100">

            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-6">
                  <span className="text-muted mb-3 lh-1 d-block text-truncate">Profit Ration</span>
                  <h4 className="mb-3">
                    <span className="counter-value" data-target="12.57">0</span>%
                  </h4>
                </div>
                <div className="col-6">
                  <div id="mini-chart4" data-colors='["#5156be"]' className="apex-charts mb-2"></div>
                </div>
              </div>
              <div className="text-nowrap">
                <span className="badge bg-success-subtle text-success">+2.95%</span>
                <span className="ms-1 text-muted font-size-13">Since last week</span>
              </div>
            </div>
          </div>
        </div>
      </div>





      <div className="card">
        <div className="card-header align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Recent Activity</h4>
        </div>

        <div className="card-body px-0" style={{maxHeight:"353px",overflowY:"scroll"}}>
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






    </AuthLayout>
  )
}

export default Index