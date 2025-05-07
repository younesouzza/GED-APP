import './featuredInfo.css'
import { ArrowDownward } from '@mui/icons-material'

export default function FeaturedInfo() {
  return (
    <div className='featured'>
        <div className="featuredItem">
            <span className='featuredTitle'>This Months Uploads</span>
            <div className="featuredContainer">
                <span className='featuredUploads'>120 uploads   </span>
                <span className='featuredRate'>
                        -20% <ArrowDownward/>
                    </span>

            </div>
            <span className="featuredSub">Compared to last month</span>
        </div>
      
    </div>
  )
}
