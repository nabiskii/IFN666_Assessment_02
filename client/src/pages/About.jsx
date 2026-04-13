import { Text, Title } from '@mantine/core';

function About() {
  return (
    <>
      <Title order={2}>About</Title>
      <Text mt="sm">PawMatch is a pet adoption management application built using Node.js, Express, MongoDB, React and Mantine.</Text>
      <Text mt="sm">Developed for IFN666 Assessment 2.</Text>
    </>
  );
}

export default About;
