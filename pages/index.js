import styles from '../styles/Home.module.css'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import SimpleAccordion from '../components/SimpleAccordion'


function Home() {

  const { loading, data, error } = useQuery(FETCH_ORDER_QUERY)

  return (
    <div className={styles.container}>
      <br/>
      <SimpleAccordion data={data} />
    </div>
  )
}

const FETCH_ORDER_QUERY = gql`
query{
  getAllOrders{
    id,
    status,
    reference,
    orderType,
    customer {
      name,
      longitude
    },
    orderItems {
      name,
      price
    },
    restaurant {
      name,
      longitude
    }
  }
}
`
export default Home