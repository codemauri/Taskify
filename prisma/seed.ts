import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const user = await prisma.user.upsert({
    where: { id: "demo-user-id" },
    update: {},
    create: {
      id: "demo-user-id",
      email: "demo@taskify.com",
      name: "Demo User",
    },
  });

  console.log("Created user:", user);

  // Create demo projects with tasks
  const project1 = await prisma.project.create({
    data: {
      title: "Website Redesign",
      description: "Complete overhaul of company website with modern design",
      userId: user.id,
      tasks: {
        create: [
          {
            title: "Design mockups",
            description: "Create initial design concepts and mockups",
            status: "Done",
          },
          {
            title: "Implement responsive layout",
            description: "Build responsive components for all screen sizes",
            status: "In Progress",
          },
          {
            title: "SEO optimization",
            description: "Optimize metadata and content for search engines",
            status: "Incomplete",
          },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: "Mobile App Development",
      description: "Build cross-platform mobile application using React Native",
      userId: user.id,
      tasks: {
        create: [
          {
            title: "Setup development environment",
            description: "Configure React Native and required dependencies",
            status: "Done",
          },
          {
            title: "Build authentication flow",
            description: "Implement login, signup, and password reset",
            status: "In Progress",
          },
          {
            title: "Create user dashboard",
            description: "Design and implement main dashboard UI",
            status: "In Progress",
          },
          {
            title: "Integrate API endpoints",
            description: "Connect frontend to backend API",
            status: "Incomplete",
          },
        ],
      },
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: "Documentation Update",
      description: "Update all technical documentation for Q4",
      userId: user.id,
      tasks: {
        create: [
          {
            title: "Review existing docs",
            description: "Audit current documentation for accuracy",
            status: "Done",
          },
          {
            title: "Write API documentation",
            description: "Document all REST API endpoints",
            status: "Incomplete",
          },
        ],
      },
    },
  });

  console.log("Created projects:", { project1, project2, project3 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
