import { Button } from '@mui/material'
import ResignedEmployeesListing from '@/views/pages/ResignationAndRecruitment/ResignedDesignationsListing'

const page = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('/recruitment-management/overview')
  }, [])
  return <div></div>
}

export default page
