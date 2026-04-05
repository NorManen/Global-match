
import "./globals.css"

export const metadata = {{
  title: "Global Match v8",
  description: "SEA Recruiter Dashboard"
}}

export default function RootLayout({{ children }}) {{
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}}
