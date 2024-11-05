import { Button } from '@mui/material';
function LandingPage() {
  return (
    <div className='w-screen h-screen grid grid-rows-10 grid-cols-12'>
      <div className='w-full text-white text-xl text-center my-auto'>Presto</div>
      <div className='grid grid-cols-9 grid-rows-1 col-start-2 col-span-10 rounded-lg row-start-2 row-span-4
        bg-gradient-to-r from-[#fff1be] from-[28%] via-[#ee87cb] via-[70%] to-[#b060ff]
        bg-200% animate-gradientShift'>

        {/* Content Container */}
        <div className='flex flex-col col-start-2 col-span-7 justify-center space-y-4'>
          <h1 className='text-xl font-bold'>Another yet powerful presentation tool</h1>

          {/* Button Wrapper */}
          <div className='flex'>
            <Button variant="contained" sx={{
              backgroundColor: 'white',
              color: 'black',        
              '&:hover': {          
                backgroundColor: '#f0f0f0', 
              },
              border: '1px solid #ccc',
              borderRadius: '16px',
              fontWeight: 550,
            }}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LandingPage;
