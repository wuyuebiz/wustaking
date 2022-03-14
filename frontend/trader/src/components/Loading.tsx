import { ReactElement } from 'react'
import animationData from 'images/banana.gif'

const Loading = ({ size = 300 }: { size?: number }): ReactElement => {
  return (
    <img src={animationData} width={size}/>
  )
}

export default Loading
