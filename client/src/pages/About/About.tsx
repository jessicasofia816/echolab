import { Link } from 'react-router'
import studioImage from "../../assets/images/studio.jpg";

export default function About() {

    const TEAM = [
        {
            name: 'Astrid Lindqvist',
            role: 'Co-founder & CEO',
            bio: 'Former principal engineer at Roland. Believes that great tools should be invisible.',
            initials: 'AL',
            color: '#3b82f6',
        },
        {
            name: 'Erik Svensson',
            role: 'Co-founder & CTO',
            bio: 'Hardware engineer, synth collector. Holds seven patents in audio signal processing.',
            initials: 'ES',
            color: '#8b5cf6',
        },
        {
            name: 'Maja Bergström',
            role: 'Head of Design',
            bio: 'Former senior designer at IKEA. Every EchoLab product starts with a single sketch on paper.',
            initials: 'MB',
            color: '#22c55e',
        },
        {
            name: 'Lars Johansson',
            role: 'Head of Engineering',
            bio: 'Acoustic engineer from KTH Stockholm. Runs marathons. Makes monitors that breathe.',
            initials: 'LJ',
            color: '#f59e0b',
        },
    ]
    const MILESTONES = [
        { year: '2018', event: 'EchoLab founded in a one-room workshop in Södermalm, Stockholm.' },
        { year: '2019', event: 'First product: the Nova Interface. 800 units sold in the first week.' },
        { year: '2020', event: 'Series A funding. Team grows to 18. Move to new studio in Liljeholmen.' },
        { year: '2021', event: 'The Pulse 49 ships. 50,000 units in 6 months. Community explodes.' },
        { year: '2022', event: 'Opens first flagship store in Stockholm. Expands distribution to 40+ countries.' },
        { year: '2023', event: 'EchoLab Pro programme launches — endorsed by 120 professional artists.' },
        { year: '2024', event: 'Carbon-neutral certification achieved across all manufacturing.' },
        { year: '2025', event: 'The Void synthesiser launches. Full product lineup of 30+ instruments.' },
    ]

    return (
        <div>
            {/* ── Hero ── */}
            <section>
                <div>
                    <div>
                        <p>Our Story</p>
                        <h1>We build tools that<br />
                            <em>disappear</em> into music. </h1>
                        <p>EchoLab was founded in Stockholm in 2018 with a single obsession: making professional music production tools that feel inevitable — as if they could never have been made any other way.</p>
                    </div>
                    <div>
                        <Link to="#">Shop the Collection →</Link>
                        <Link to="#">Get in Touch</Link>
                    </div>
                </div>
            </section>
            {/* ── Studio photo ── */}
            <section>
                <div>

                    <img src={studioImage} alt="Studio" />
                    <div>

                    </div>
                </div>
            </section>
            {/* ── Values ── */}
            <section>
                <div>
                    <div>
                        <div>
                            <p> Our Philosophy</p>
                            <h2>Fewer, better things.</h2>
                            <p>We don't make 400 products. We make a focused range of instruments that we believe in completely. Each one takes years of iteration. We release when ready, not when scheduled.</p>
                            <p>The result is a catalogue where every product earns its place by being the best in its class — not just good enough, but definitive.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { number: '50K+', label: 'Artists worldwide' },
                                { number: '80+', label: 'Countries' },
                                { number: '4.9/5', label: 'Average rating' },
                                { number: '5yr', label: 'Full warranty' },
                            ].map(s => (
                                <div key={s.label} className="
                                rounded-[14px]
                                border
                                border-border
                                bg-surface
                                px-5
                                py-7
                                text-center
                            ">
                                    <div className="
                                    mb-1.5
                                    font-mono
                                    text-4xl
                                    font-bold
                                    tracking-[-0.02em]
                                    text-primary
                                    ">
                                        {s.number}
                                    </div>
                                    <div className="text-[13px] text-text-muted">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {/* ── Team ── */}
            <section>
                <div>
                    <div>
                        <p>The Team</p>
                        <h2>Built by obsessives, for obsessives.</h2>
                    </div>
                    <div className="team-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {TEAM.map((member) => (
                            <div
                                key={member.name}
                                className="
                                rounded-2xl
                                border
                                border-border
                                bg-bg
                                px-5.5
                                py-7
                                text-center
                                transition-colors
                                duration-200
                                hover:border-(--color-border-strong)
                            "
                            >
                                <div
                                    className="
                                    mx-auto
                                    mb-5
                                    flex
                                    h-16
                                    w-16
                                    items-center
                                    justify-center
                                    rounded-full
                                    border-2
                                    font-mono
                                    text-xl
                                    font-bold
                                    "
                                    style={{
                                        backgroundColor: `${member.color}18`,
                                        borderColor: `${member.color}30`,
                                        color: member.color,
                                    }}
                                >
                                    {member.initials}
                                </div>

                                <h3 className="mb-1 text-[15px] font-bold text-text">
                                    {member.name}
                                </h3>

                                <p
                                    className="
                                    mb-3
                                    text-xs
                                    font-semibold
                                    tracking-[0.02em]
                                    "
                                    style={{ color: member.color }}
                                >
                                    {member.role}
                                </p>

                                <p className="text-[13px] leading-relaxed text-text-muted">
                                    {member.bio}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* ── Timeline ── */}
            <section>
                <div>
                    <div>
                        <div>
                            <p>History</p>
                            <h2>From a workshop to the world.</h2>
                            <p>Seven years ago, two engineers set out to build the audio interface they wished existed. Today, EchoLab is the instrument brand trusted by some of the world's most celebrated producers and performers.</p>
                        </div>
                        <div className="flex flex-col gap-0">
                            {MILESTONES.map((m, i) => (
                                <div
                                    key={m.year}
                                    className={`
                                    relative
                                    flex
                                    gap-5
                                    ${i < MILESTONES.length - 1 ? "pb-6" : ""}
                                `}
                                >
                                    {/* Line */}
                                    {i < MILESTONES.length - 1 && (
                                        <div
                                            className="
                                            absolute
                                            left-7.5
                                            top-7
                                            bottom-0
                                            w-px
                                            bg-border
                                        "
                                        />
                                    )}

                                    <div
                                        className="
                                        w-15
                                        shrink-0
                                        pt-0.75
                                        font-mono
                                        text-[13px]
                                        font-bold
                                        text-primary
                                        "
                                    >
                                        {m.year}
                                    </div>

                                    <div
                                        className="
                                        mt-1.5
                                        h-2
                                        w-2
                                        shrink-0
                                        rounded-full
                                        bg-primary
                                        "
                                    />

                                    <div className="flex-1 pb-1">
                                        <p className="text-sm leading-relaxed text-text">
                                            {m.event}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
            {/* ── Sustainability ── */}
            <section>
                <div>
                    <p>Sustaianability</p>
                    <h2>Good products should do good.</h2>
                    <p>Carbon-neutral manufacturing since 2024. Recycled aluminium in every chassis. FSC-certified packaging. We're not perfect — but we're trying harder than anyone else.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            { label: "Carbon Neutral", desc: "Since 2024" },
                            { label: "Recycled Aluminium", desc: "80% of each chassis" },
                            { label: "FSC Packaging", desc: "100% certified" },
                        ].map((b) => (
                            <div
                                key={b.label}
                                className="
                                min-w-40
                                rounded-xl
                                border
                                px-5
                                py-4
                            "
                                style={{
                                    backgroundColor: "rgba(34,197,94,0.06)",
                                    borderColor: "rgba(34,197,94,0.15)",
                                }}
                            >
                                <div className="mb-1 text-sm font-bold text-green-500">
                                    {b.label}
                                </div>

                                <div className="text-xs text-text-muted">
                                    {b.desc}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


        </div>
    );
}