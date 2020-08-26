import React, { useEffect, MutableRefObject } from 'react'
import { useQuery } from '@apollo/client'
import {
  GET_PRODUCTLIST_BY_CATEGORY,
  ProductByCategoryData,
  ProductByCategoryVars,
} from '../../apis/graphqlQuery'
import { VerticalList } from '../../components/VerticalList'

type Props = {
  page: number
  onePageLength: number
  sorter: string
  categoryName: string
  noMoreProducts: MutableRefObject<boolean>
}

export const ProductBlock = (props: Props) => {
  const { page, onePageLength, sorter, categoryName } = props
  const { loading, data } = useQuery<ProductByCategoryData, ProductByCategoryVars>(
    GET_PRODUCTLIST_BY_CATEGORY,
    {
      variables: {
        category: categoryName,
        offset: page * onePageLength,
        limit: onePageLength,
        sorter: sorter,
      },
    }
  )

  useEffect(() => {
    if (data && data.productListByCategory && data.productListByCategory.length < onePageLength) {
      props.noMoreProducts.current = true
    }
  }, [data])

  return loading || !data ? (
    <div>Loading...</div>
  ) : (
    <VerticalList title="" productList={data.productListByCategory} />
  )
}
