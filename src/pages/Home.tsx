import Section from "../components/section/Section.tsx";
import Timeline from "../components/timeline/Timeline.tsx";
import Tag from "../components/tag/Tag.tsx";
import {
    IconBrandGithub, IconBrandInstagram,
    IconBrandLinkedin, IconMail, IconMeteor,
    IconPlanet,
    IconSatellite,
    IconTelescope,
    IconUfo
} from "@tabler/icons-react";
import Colored from "../components/Colored.tsx";
import styles from './Home.module.css';
import ColoredLink from "../components/ColoredLink.tsx";

export default function Home() {
    const languages = [
        'Kotlin', 'Java',  'C#', 'TypeScript', 'JavaScript', 'Python', 'C++', 'C', 'PHP', 'SQL', 'NoSQL', 'Lua', 'Bash'
    ];

    const frameworksAndPlatforms = [
        // Web & Frontend
        'React', 'Vue', 'Angular', 'HTML', 'CSS', 'SCSS',
        // Backend & Services
        'Node', 'Laravel', 'Symfony', 'Auth0', 'MQTT', 'Azure Service Bus',
        // Databases
        'PostgreSQL', 'MariaDB', 'MySQL', 'MSSQL', 'MongoDB', 'Redis',
        // DevOps & Infrastructure
        'Docker', 'Kubernetes', 'Rancher', 'Helm', 'Prometheus', 'Grafana', 'Elastic', 'Kibana',
        // Game Engines & Target Platforms
        'Unity', 'Godot', 'Unreal Engine', 'Android', 'Arduino'
    ];

    const toolsAndEnvironment = [
        // AI & Version Control
        'Claude', 'GitHub Copilot', 'Git', 'GitHub', 'GitLab', 'Bitbucket',
        // IDEs & Developer Tools
        'IntelliJ IDEA', 'Rider', 'DataGrip', 'ReSharper', 'Visual Studio', 'VS Code', 'Postman', 'Bruno', 'SSH',
        // Management & Operating Systems
        'Jira', 'Confluence', 'Linux', 'Windows', 'macOS'
    ];

    return (
        <div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <p className="title">
                        Hi there!<br/>
                        I am <Colored inline>Benedikt Wüller</Colored>,<br/>
                        Senior Software Engineer.
                    </p>

                    <p className="subtitle">
                        Located in Aachen, Germany.
                    </p>
                </div>

                <div>
                    <div className={styles.socials}>
                        <a href="https://github.com/benedikt-wueller" target="_blank"><IconBrandGithub style={{ display: 'block' }} size="1em" /></a>
                        <a href="https://www.instagram.com/benediktiergeraet" target="_blank"><IconBrandInstagram style={{ display: 'block' }} size="1em" /></a>
                        <a href="https://www.linkedin.com/in/benedikt-w%C3%BCller-391b57229/" target="_blank"><IconBrandLinkedin style={{ display: 'block' }} size="1em" /></a>
                        <a href="mailto:contact@benedikt.dev" target="_blank"><IconMail style={{ display: 'block' }} size="1em" /></a>

                        <div className={styles.dftba} />
                    </div>
                </div>
            </div>

            <div className={styles.group}>
                <Section title={<><IconTelescope stroke={1.5}/><span>Professional Career</span></>}>
                    <Timeline items={[
                        {
                            from: '10|21', to: 'today',
                            title: 'FARO Technologies Inc.',
                            subtitle: 'Backend Software Engineer',
                            description: (<>
                                Architecture, development and maintenance of the main API, process orchestration system,
                                agentic AI solutions and secondary services for <ColoredLink href="https://www.holobuilder.com/">Sphere XG</ColoredLink>.
                            </>),
                            tags: ['C#', 'ASP.NET', 'EFCore', 'MSSQL', 'Kotlin', 'Redis', 'Kubernetes', 'Azure', 'Mend', 'Claude', 'Github Copilot']
                        },
                        {
                            from: '10|18', to: '09|21',
                            title: 'LPR IT Solutions GmbH',
                            subtitle: 'Full Stack Software Engineer',
                            description: 'Development and maintenance of internal and external web applications and backend services. Setup and development of infrastructure solutions and CI/CD pipelines.',
                            tags: ['PHP', 'Laravel', 'Vue', 'React', 'Angular', 'MariaDB', 'Redis', 'Java', 'Kotlin', 'Kubernetes', 'Rancher', 'GitLab Pipelines'],
                            muted: true
                        },
                        {
                            from: '10|15', to: '09|18',
                            title: 'WESTWERK GmbH & Co. KG',
                            subtitle: 'Full Stack Software Engineer',
                            description: 'Development and maintenance of customer applications, backend services and smart home networking solutions.',
                            tags: ['PHP', 'Laravel', 'Vue', 'React', 'MariaDB', 'Ubiquiti', 'Docker', 'Scrum'],
                            muted: true
                        },
                        {
                            from: '08|15', to: '07|18',
                            title: 'BWV Aachen',
                            subtitle: 'IT Specialist for Application Development',
                            description: (<>
                                Completed{' '}
                                <ColoredLink href="https://www.make-it-in-germany.com/en/study-vocational-training/training-in-germany/vocational">dual vocational training</ColoredLink>{' '}
                                as an IT Specialist for Application Development (Grade: 92%)
                            </>),
                            tags: ['C', 'C++', 'Java', 'SQL', 'Scrum'],
                            muted: true
                        }
                    ]}/>
                </Section>

                <Section title={<><IconMeteor stroke={1.5}/><span>Noteworthy Side Projects</span></>}>
                    <Timeline items={[
                        {
                            from: '08|23', to: 'today',
                            title: 'Cardgourmet',
                            subtitle: 'Co-founder / Software Developer',
                            description: (<>
                                All-in-one{' '}
                                <ColoredLink href="https://cardgourmet.com/">trading card platform</ColoredLink>{' '}
                                with card database, a powerful search engine, and more to come.
                            </>),
                            tags: ['Kotlin', 'PostgreSQL', 'React', 'TypeScript', 'Docker', 'Traefik']
                        },
                        {
                            from: '06|21', to: 'today',
                            title: 'Benevoland, Inh. Benedikt Wüller',
                            subtitle: 'Founder / Software Developer',
                            description: (<>
                                Independent software development, including unique video games like{' '}
                                <ColoredLink href="https://store.steampowered.com/app/1969570/Shenanigans/">Shenanigans</ColoredLink>.
                            </>),
                            tags: ['Kotlin', 'C#', 'Unity', 'Godot', 'Figma', 'PHP', 'WordPress']
                        },
                        {
                            from: '10|19', to: '04|21',
                            title: 'Volix UG (haftungsbeschränkt)',
                            subtitle: 'Team Manager / Lead Software Developer',
                            description: 'Team management, project management and operation of the video game network RewisServer. Development of infrastructure solutions, backend services and game server plugins.',
                            tags: ['Java', 'Kotlin', 'MongoDB', 'Docker', 'Prometheus', 'HAProxy'],
                            muted: true
                        },
                        {
                            from: '07|16', to: '04|18',
                            title: 'BergwerkLABS',
                            subtitle: 'Team Manager / Lead Software Developer',
                            description: 'Team management, project management and operation of the video game network BergwerkLABS. Development of infrastructure solutions, backend services, web applications and game server plugins.',
                            tags: ['Java', 'Kotlin', 'MariaDB', 'Docker', 'JavaScript', 'Vue', 'PHP'],
                            muted: true
                        },
                    ]}/>
                </Section>
            </div>

            <div className={styles.group}>
                <Section title={<><IconUfo stroke={1.5}/><span>Languages</span></>} muted>
                    <>
                        {languages.map((tag, index) => (
                            <><Tag value={tag} key={index}/>{' '}</>
                        ))}
                    </>
                </Section>

                <Section title={<><IconSatellite stroke={1.5}/><span>Frameworks & Platforms</span></>} muted>
                    <>
                        {frameworksAndPlatforms.map((tag, index) => (
                            <><Tag value={tag} key={index}/>{' '}</>
                        ))}
                    </>
                </Section>

                <Section title={<><IconPlanet stroke={1.5}/> <span>Tools & Environment</span></>} muted>
                    <>
                        {toolsAndEnvironment.map((tag, index) => (
                            <><Tag value={tag} key={index}/>{' '}</>
                        ))}
                    </>
                </Section>
            </div>
        </div>
    );
}