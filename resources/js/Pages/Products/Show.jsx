import React from 'react'
import AuthLayout from '../../Layouts/AuthLayout'
import { Head, usePage } from '@inertiajs/react'
import AuthorizeLink from '../../components/AuthorizeLink'
import { Card, CardBody, CardFooter, CardHeader } from '../../components/Card'
import { CustomTable, TBody, TRow, TData } from '../../components/Table'

function Show({ product }) {

  const { system } = usePage().props

  console.log(product)

  return (
    <AuthLayout>
      <Head title='Product | Show - ' />

      <Card>

        <CardHeader>
          <h4 className='card-title'>Show Product</h4>
          <p className='card-title-desc'>View detailed product information and specifications.</p>
        </CardHeader>

        <CardBody>

          <div className="row">

            <div className="col-md-8">
              <div className="table-responsive">
                <CustomTable>
                  <TBody>

                    <TRow>
                      <TData><b>Name</b></TData>
                      <TData>{product.name}</TData>
                    </TRow>

                    <TRow>
                      <TData><b>Code</b></TData>
                      <TData>{product.code}</TData>
                    </TRow>

                    <TRow>
                      <TData><b>Brand</b></TData>
                      <TData>{product.brand.name}</TData>
                    </TRow>

                    <TRow>
                      <TData><b>Category</b></TData>
                      <TData>{product.category.name}</TData>
                    </TRow>

                    <TRow>
                      <TData><b>Sub Category</b></TData>
                      <TData>{product.sub_category.name}</TData>
                    </TRow>

                    <TRow>
                      <TData><b>Barcode Symbology</b></TData>
                      <TData>{product.barcode_symbology}</TData>
                    </TRow>

                    <TRow>
                      <TData><b>Cost</b></TData>
                      <TData>{system.currency.symbol} {product.cost} </TData>
                    </TRow>

                    <TRow>
                      <TData><b>Price</b></TData>
                      <TData>{system.currency.symbol} {product.price}</TData>
                    </TRow>

                    <TRow>
                      <TData><b>Unit</b></TData>
                      <TData>{product.unit.name}</TData>
                    </TRow>

                    <TRow>
                      <TData><b>Sale Unit</b></TData>
                      <TData>{product.sale_unit.name}</TData>
                    </TRow>

                    <TRow>
                      <TData><b>Purchase Unit</b></TData>
                      <TData>{product.purchase_unit.name}</TData>
                    </TRow>

                    <TRow>
                      <TData><b>Stock Alert</b></TData>
                      <TData>{product.stock_alert} {product.unit.name}</TData>
                    </TRow>

                    <TRow>
                      <TData><b>Expiration Alert</b></TData>
                      <TData>{product.is_batch == 1 ? product.expiration_alert : "None"} {product.is_batch == 1 && product.unit.name}</TData>
                    </TRow>

                    <TRow>
                      <TData><b>Tex Method</b></TData>
                      <TData>{product.tax_method}</TData>
                    </TRow>

                    <TRow>
                      <TData><b>Orders Tex</b></TData>
                      <TData>{product.net_tax} %</TData>
                    </TRow>

                    <TRow>
                      <TData><b>Batch And Expiration</b></TData>
                      <TData>{product.is_batch ? "YES" : "NO"}</TData>
                    </TRow>

                    <TRow>
                      <TData><b>Active</b></TData>
                      <TData>{product.is_active ? "Active" : "InActive"}</TData>
                    </TRow>

                    <TRow>
                      <TData><b>Description</b></TData>
                      <TData>{product.description}</TData>
                    </TRow>

                  </TBody>
                </CustomTable>

              </div>
            </div>

            <div className="col-md-4">
              <img
                src={product.image}
                alt="Product Image"
                className='img-fluid'
                style={{
                  maxWidth: '200px',
                  maxHeight: '100%',
                }} />
            </div>

          </div>

        </CardBody>

        <CardFooter>
          <AuthorizeLink ability={'product.edit'} href={route('product.edit',product)} className="btn btn-primary px-4">
                Edit
          </AuthorizeLink>
        </CardFooter>

      </Card>

    </AuthLayout>
  )
}

export default Show