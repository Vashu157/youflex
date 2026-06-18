import React from 'react'

const page = () => {
  return (
    <div>
        <form action={addProfile}>
            <input name="leetcode_profile"  placeholder='enter your leetcode username'/>
            <input name="codeforces_profile"  placeholder='enter your codeforces username'/>
            <input name="linkedin_profile"  placeholder='enter your linkedoin username'/>
            <input name="replit_profile"  placeholder='enter your replit username'/>
            <input name="github_profile"  placeholder='enter your github username'/>
            <button type='submit'>Submit details</button>
        </form>
        
    </div>
  )
}

export default page