import { icons } from '../utils/icons.js'

const interestOptions = [
    'Technology', 'Design', 'Business', 'Arts', 'Science', 'Engineering',
    'Medicine', 'Law', 'Education', 'Sports', 'Music', 'Photography',
    'Writing', 'Marketing', 'Finance', 'Entrepreneurship'
]

const skillOptions = [
    'React', 'Next.js', 'TypeScript', 'Python', 'Java', 'JavaScript',
    'Design', 'UI/UX', 'Figma', 'Machine Learning', 'Data Science',
    'Mobile Development', 'Web Development', 'Photography', 'Video Editing',
    'Business Strategy', 'Marketing', 'Finance', 'Leadership'
]

export function renderSignupPage(container, onSignup, onSwitchToLogin) {
    let step = 1
    let showPassword = false

    const formData = {
        name: '',
        email: '',
        password: '',
        college: '',
        year: '',
        interests: [],
        skills: [],
    }

    const toggleItem = (list, value) => {
        const index = list.indexOf(value)
        index > -1 ? list.splice(index, 1) : list.push(value)
    }

    const handleNext = () => {
        if (step < 3) {
            step++
            render()
        }
    }

    const handleSubmit = () => {
        console.log('DEMO SUBMIT →', formData)
        onSignup(formData)
    }

    const render = () => {
        container.innerHTML = `
            <div class="min-h-screen bg-bg-primary flex items-center justify-center p-4">
                <div class="w-full max-w-2xl fade-in">

                    <!-- LOGO -->
                    <div class="text-center mb-8 flex flex-col items-center gap-3">
                        <img src="/logo.svg" alt="Unify Logo" class="h-14 w-auto" />
                        <p class="text-text-secondary">
                            Create your account to discover amazing events
                        </p>
                    </div>

                    <div class="bg-bg-secondary rounded-2xl p-8 border border-border shadow-lg">

                        <!-- STEPS -->
                        <div class="flex items-center justify-center gap-2 mb-6">
                            ${[1, 2, 3].map(s => `
                                <div class="h-1.5 rounded-full transition-all ${
                                    s <= step ? 'bg-primary w-8' : 'bg-border w-1.5'
                                }"></div>
                            `).join('')}
                        </div>

                        ${
                            step === 1 ? `
                            <div class="space-y-5">
                                <div>
                                    <label class="text-sm font-semibold mb-2 block">Full Name</label>
                                    <div class="relative">
                                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                                            ${icons.User()}
                                        </span>
                                        <input
                                            id="name"
                                            class="w-full pl-10 py-3 rounded-xl bg-surface border border-border"
                                            placeholder="Demo User"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label class="text-sm font-semibold mb-2 block">Roll No</label>
                                    <div class="relative">
                                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                                            ${icons.Mail()}
                                        </span>
                                        <input
                                            id="email"
                                            class="w-full pl-10 py-3 rounded-xl bg-surface border border-border"
                                            placeholder="250010019145"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label class="text-sm font-semibold mb-2 block">Password</label>
                                    <div class="relative">
                                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                                            ${icons.Lock()}
                                        </span>
                                        <input
                                            id="password"
                                            type="${showPassword ? 'text' : 'password'}"
                                            class="w-full pl-10 pr-12 py-3 rounded-xl bg-surface border border-border"
                                        />
                                        <button
                                            id="toggle-password"
                                            class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                                        >
                                            ${showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ` : step === 2 ? `
                            <div class="space-y-5">
                                <div>
                                    <label class="text-sm font-semibold mb-2 block">College</label>
                                    <input
                                        id="college"
                                        class="w-full py-3 px-4 rounded-xl bg-surface border border-border"
                                        placeholder="DCRUST"
                                    />
                                </div>

                                <div>
                                    <label class="text-sm font-semibold mb-2 block">Year</label>
                                    <select
                                        id="year"
                                        class="w-full py-3 px-4 rounded-xl bg-surface border border-border"
                                    >
                                        <option value="">Any</option>
                                        <option>1st Year</option>
                                        <option>2nd Year</option>
                                        <option>3rd Year</option>
                                        <option>4th Year</option>
                                    </select>
                                </div>
                            </div>
                        ` : `
                            <div class="space-y-6">
                                <div>
                                    <label class="text-sm font-semibold mb-3 block">Interests</label>
                                    <div class="flex flex-wrap gap-2">
                                        ${interestOptions.map(i => `
                                            <button
                                                type="button"
                                                data-interest="${i}"
                                                class="interest-btn px-4 py-2 rounded-xl border transition-all ${
                                                    formData.interests.includes(i)
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'bg-surface text-text-secondary border-border hover:bg-border'
                                                }"
                                            >
                                                ${i}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>

                                <div>
                                    <label class="text-sm font-semibold mb-3 block">Skills</label>
                                    <div class="flex flex-wrap gap-2">
                                        ${skillOptions.map(s => `
                                            <button
                                                type="button"
                                                data-skill="${s}"
                                                class="skill-btn px-4 py-2 rounded-xl border transition-all ${
                                                    formData.skills.includes(s)
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'bg-surface text-text-secondary border-border hover:bg-border'
                                                }"
                                            >
                                                ${s}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        `}
                        
                        <!-- ACTIONS -->
                        <div class="flex gap-3 mt-8">
                            ${step > 1 ? `
                                <button id="back" class="flex-1 py-3 rounded-xl bg-surface border border-border">
                                    Back
                                </button>
                            ` : ''}
                            ${step < 3 ? `
                                <button id="next" class="flex-1 py-3 rounded-xl bg-primary text-white">
                                    Next
                                </button>
                            ` : `
                                <button id="submit" class="flex-1 py-3 rounded-xl bg-primary text-white">
                                    Create Account
                                </button>
                            `}
                        </div>

                        <div class="mt-6 text-center text-sm text-text-secondary">
                            Already have an account?
                            <button id="switch" class="text-primary font-semibold">Sign in</button>
                        </div>
                    </div>
                </div>
            </div>
        `

        // Inputs
        container.querySelector('#name')?.addEventListener('input', e => formData.name = e.target.value)
        container.querySelector('#email')?.addEventListener('input', e => formData.email = e.target.value)
        container.querySelector('#password')?.addEventListener('input', e => formData.password = e.target.value)
        container.querySelector('#college')?.addEventListener('input', e => formData.college = e.target.value)
        container.querySelector('#year')?.addEventListener('change', e => formData.year = e.target.value)

        container.querySelector('#toggle-password')?.addEventListener('click', () => {
            showPassword = !showPassword
            render()
        })

        container.querySelector('#back')?.addEventListener('click', () => {
            step--
            render()
        })

        container.querySelector('#next')?.addEventListener('click', handleNext)
        container.querySelector('#submit')?.addEventListener('click', handleSubmit)
        container.querySelector('#switch')?.addEventListener('click', onSwitchToLogin)

        container.querySelectorAll('.interest-btn').forEach(btn =>
            btn.addEventListener('click', () => {
                toggleItem(formData.interests, btn.dataset.interest)
                render()
            })
        )

        container.querySelectorAll('.skill-btn').forEach(btn =>
            btn.addEventListener('click', () => {
                toggleItem(formData.skills, btn.dataset.skill)
                render()
            })
        )
    }

    render()
}
