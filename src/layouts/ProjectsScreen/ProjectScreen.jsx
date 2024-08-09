import { useParams } from 'react-router-dom'
import data from '../../assets/data/ProjectsDetailData.json'
import decorGreen01 from '../../assets/images/decor/green01.svg'
import decorGreen02 from '../../assets/images/decor/green02.svg'
import decorGray01 from '../../assets/images/decor/gray01.svg'
import '../../scss/layouts/ProjectsScreen/ProjectScreen.scss'
import ReactPlayer from 'react-player/lazy';

function ProjectScreen() {
    const projectIdParam = useParams().id;
    const project = data.find(project => project.id === projectIdParam);

    if (!project) {
        return <div>404 Not Found</div>;
    }

    const { logo, title, type, links, beginDate, launchDate, images, descriptions } = project;


    return (
        <>
            {title && (
                <div className='container project-detail-container mt-5'>
                    <div className="decor-container">
                        <img src={decorGreen01} alt="decoration shape" className="decor-green01" />
                        <img src={decorGreen02} alt="decoration shape" className="decor-green02" />
                        <img src={decorGreen02} alt="decoration shape" className="decor-green03" />
                        <img src={decorGray01} alt="decoration shape" className="decor-gray01" />
                    </div>
                    <div className="project-intro pt-5">
                        <img src={logo} alt="logo" />
                        <h1>{title}</h1>
                        <span><a href={links.deploy}>{type}</a> Application</span>
                        <span><a href={links.git}>Github</a> Repository</span>
                        <span>Begin: {beginDate}</span>
                        <span>Launch: {launchDate}</span>
                    </div>

                    <div className="intro-video">
                        <ReactPlayer url={links.video}
                            className='react-player'
                            width='100%'
                            height='100%'
                            playing={true}
                            muted={true}
                            loop={true}
                            controls={true}
                            />
                    </div>

                    <div className="project-content">
                        <br />
                        <br />
                        <br />
                        <br />
                        <p>{descriptions[0]}</p>
                        {images.map((image, index) => (
                            <div key={index}>
                                <img src={image} alt="project" />
                                <p>{descriptions[index]}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!title && <div>There is no more detail for this project.</div>}

        </>

    )
}

export default ProjectScreen