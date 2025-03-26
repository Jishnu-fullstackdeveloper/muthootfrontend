import React from 'react';
import { useRouter } from 'next/navigation'
import {
   
    Button, 
} from '@mui/material'
const SystemManagement = () => {
    
  const router = useRouter() // Initialize router if using Next.js
    
    const XFactor = (id: string) => {
        router.push(`/system-management/view/xfactor`); // Fixed path naming convention and syntax
    };

    return (
        <div>
         <Button onClick={() => XFactor('someId')}>
               XFactor
            </Button>
        </div>
    );
};

export default SystemManagement;
