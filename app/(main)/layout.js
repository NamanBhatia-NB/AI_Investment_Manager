import React from 'react'

const MainLayout = ({children}) => {
  return (
    <div className='container mx-auto my-38 md:my-32'>
      {children}
    </div>
  )
}

export default MainLayout;
