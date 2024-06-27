import React from 'react'
import AuthLayout from '../../Layouts/AuthLayout'
import ActivityLog from './ActivityLog'

function Index({ logs }) {

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

     <ActivityLog logs={logs}/>

    </AuthLayout>
  )
}

export default Index