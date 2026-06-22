export default function ProfileCard({leetcode_link,codeforces_link,linkedin_link,replit_link,github_link}){
    return(
        <div>
            <div>profile photo</div>
            <div><a href="{github_link}">github</a></div>
            <div><a href="{leetcode_link}">leet</a></div>
            <div><a href="{codeforces_link}">cf</a></div>
            <div><a href="{linkedin_link}">lnkdin</a></div>
            <div><a href="{replit_link}">replit</a></div>
        </div>
    );
}