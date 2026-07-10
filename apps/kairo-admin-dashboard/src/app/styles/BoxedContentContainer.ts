import styled from "styled-components";

const BoxedContentContainer = styled.div`
  position: relative;
  width: 100%;
  /* min-height: 80vh; */
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  padding: 1.5rem;
`;

export default BoxedContentContainer;
