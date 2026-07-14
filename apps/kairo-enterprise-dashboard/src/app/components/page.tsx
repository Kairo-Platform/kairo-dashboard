"use client";

import { useState } from "react";
import {
  FormGroup,
  FormInput,
  SelectInput,
  DatePickerInput,
  DatePickerInputV2,
  CheckboxInput,
  RadioInput,
  FileInput,
  SearchInput,
  SimpleSearch,
  SwitchInput,
} from "@/app/components/ui/inputs";
import {
  Tabs,
  Modal,
  Flex,
  Button,
  ButtonClass,
  ButtonSize,
  StarRating,
  MediaDropzoneCarousel,
  Tag,
  TagType,
} from "@/app/components/ui";
import { DoughnutChart, LineChart, mapSelectOptions } from "@/lib/utils";
import { useModal } from "@kairo/hooks";
import styled from "styled-components";
import { DashboardLayout } from "@/app/components/dashboard";
import { Icon } from "@iconify/react";
import { PAYMENT_STATUS } from "@/lib/constants";

const ComponentsContainer = styled.div``;
const pageTitle = "Components";

const options = ["chocolate", "strawberry", "vanilla"];

const ComponentsPage: React.FC = () => {
  const [status, setStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const onDateRangeChange = (dates: Array<Date | null>) => {
    const [start, end] = dates;
    setStartDate(start ?? null);
    setEndDate(end ?? null);
  };

  const checkboxOptions = ["red", "blue", "green"];
  const radioOptions = [
    { value: "fair", label: "Fair" },
    { value: "good", label: "Good" },
    { value: "nice", label: "Nice" },
  ];

  const [files, setFiles] = useState<FileList | null>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [switchValue, setSwitchValue] = useState<boolean>(false);

  const sampleTabs = [
    {
      title: "Kaeyz",
      content: () => <div>Kaeyz is here</div>,
    },
    {
      title: "Okiki",
      content: () => <div>Eri is here</div>,
    },
    {
      title: "Tunji Oye",
      content: () => <div>Tunji is here</div>,
    },
    {
      title: "Joy",
      content: () => <div>Dammie is here</div>,
    },
    {
      title: "Mubby",
      content: () => <div>Mubby is here</div>,
    },
    {
      title: "Stanley",
      content: () => <div>Stanley is here</div>,
    },
  ];

  const { showModal: showFirstModal, toggleModal: toggleFirstModal } =
    useModal() as any;
  const { showModal: showSecondModal, toggleModal: toggleSecondModal } =
    useModal() as any;

  return (
    <DashboardLayout pageTitle={pageTitle}>
      <ComponentsContainer>
        <Flex direction="column">
          <Flex direction="column" gap="0.5rem">
            <h4>Modal </h4>
            <Button onClick={toggleFirstModal} classes={[ButtonClass.SOLID]}>
              Open First Modal
            </Button>
            {showFirstModal && (
              <Modal title="Modal Title" onClose={toggleFirstModal}>
                I am the content of the first modal
              </Modal>
            )}

            <Button
              onClick={toggleSecondModal}
              classes={[ButtonClass.OUTLINED]}
            >
              Open Second Modal
            </Button>
            {showSecondModal && (
              <Modal title="Dammie Title" onClose={toggleSecondModal}>
                I am the content of the second modal
              </Modal>
            )}
          </Flex>

          <Flex direction="column" gap="0.5rem">
            <h4>Tabs </h4>
            <Tabs tabs={sampleTabs} tabType="tab-button" />
            <Tabs tabs={sampleTabs} />
          </Flex>

          <Flex direction="column" gap="0.5rem">
            <h4>Button </h4>
            <Button classes={[ButtonClass.SOLID]} size={ButtonSize.WIDTH_140}>
              Solid Button
            </Button>
            <Button
              classes={[ButtonClass.SOLID]}
              style={{ width: "300px", backgroundColor: "green" }}
            >
              Styleable Button
            </Button>
            <Button classes={[ButtonClass.SOLID_RED]} size={ButtonSize.LARGE}>
              Outlined Button
            </Button>
            <Button classes={[ButtonClass.OUTLINED]}>Auto width Button</Button>
            <Button classes={[ButtonClass.SOLID]} size={ButtonSize.FULL}>
              Full width Button
            </Button>
            <Button classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}>
              <span>Button with icon </span>
              <Icon icon="mdi:calendar" width={15} height={15} />
            </Button>
            <Button
              classes={[ButtonClass.SOLID]}
              size={ButtonSize.LARGE}
              disabled
            >
              Disabled Button
            </Button>
            <Button classes={["btn--no-bg", "btn--text-only"]}>
              Text Only
            </Button>
            <Button classes={["btn--no-bg", "btn--icon-only"]}>
              <Icon icon="mdi:calendar" width={20} height={20} />
            </Button>
          </Flex>
        </Flex>

        <br />

        <FormGroup>
          <h4>Form Input </h4>
          <FormInput label="MMO Name" name="mmo_name" />
        </FormGroup>

        <FormGroup>
          <h4>Search Input </h4>
          <SearchInput label="Search" name="search" />
        </FormGroup>

        <FormGroup>
          <h4>Simple Search </h4>
          <SimpleSearch placeholder="Search" name="s" />
        </FormGroup>

        <FormGroup>
          <h4>Select Input </h4>
          <SelectInput
            label="Select Status"
            name="status"
            options={mapSelectOptions(options)}
            onChange={setStatus}
            value={status}
          // required
          />
        </FormGroup>

        <FormGroup>
          <h4>Date Picker Input </h4>
          <DatePickerInput
            label="Start Date"
            value={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </FormGroup>

        <FormGroup>
          <h4>Date Range Picker Input </h4>
          <DatePickerInputV2
            label="Start Date - End Date"
            value={[startDate, endDate]}
            onChange={onDateRangeChange}
            selectsRange
          />
        </FormGroup>

        <FormGroup>
          <h4>Date Range Picker Input V2</h4>
          <DatePickerInputV2
            label="Start Date - End Date"
            value={[startDate, endDate]}
            onChange={onDateRangeChange}
            selectsRange
            showSideBarQuickActions
          />
        </FormGroup>

        <FormGroup>
          <h4>Email Input </h4>
          <FormInput label="Email Address" type="email" />
        </FormGroup>

        <FormGroup>
          <h4>Password </h4>
          <FormInput label="Password" type="password" />
        </FormGroup>

        <FormGroup>
          <h4>Checkbox Input </h4>
          <CheckboxInput options={checkboxOptions} />
        </FormGroup>

        <FormGroup>
          <h4>Radio Input</h4>
          <RadioInput options={radioOptions} />
        </FormGroup>

        <FormGroup>
          <h4>Switch Input</h4>
          <SwitchInput value={switchValue} onChange={setSwitchValue} />
        </FormGroup>

        <FormGroup>
          <h4>File Dropzone</h4>
          <FileInput
            label="Select File"
            files={files}
            onChange={(e) => setFiles(e.target.files)}
          />
        </FormGroup>

        <FormGroup>
          <h4>Tag</h4>
          <Tag type={TagType.GREEN}>
            <Icon
              icon="lets-icons:check-fill"
              width="16"
              height="16"
              style={{ marginRight: "4px" }}
            />
            <span>Green</span>
          </Tag>
        </FormGroup>

        <FormGroup>
          <h4>Payment status</h4>
          <Tag type={PAYMENT_STATUS.pending.tagColor}>
            <Icon
              icon={PAYMENT_STATUS.pending.icon}
              width="16"
              height="16"
              style={{ marginRight: "4px" }}
            />
            <span>{PAYMENT_STATUS.pending.label}</span>
          </Tag>
        </FormGroup>

        <FormGroup>
          <h4>Star Rating</h4>
          <div style={{ width: "max-content" }}>
            <StarRating rating={4} setRating={true} />
          </div>
        </FormGroup>

        <FormGroup>
          <h4>Doughnut Chart</h4>
          <DoughnutChart
            title="Users"
            data={[
              { label: "Users", value: 1250, color: "#FF8C4A" },
              { label: "Agents", value: 450, color: "#BF6938" },
              { label: "Merchants", value: 300, color: "#804625" },
            ]}
            width={300}
            height={300}
            showPercentageLabels
            showLegend
            cutout={"60%"}
            options={{
              plugins: {
                legend: {
                  position: "bottom",
                  align: "center",
                  labels: {
                    padding: 15,
                    boxWidth: 15,
                    boxHeight: 15,
                    usePointStyle: false,
                    font: {
                      size: 12,
                    },
                  },
                },
              },
              layout: {
                padding: {
                  bottom: 0,
                  top: 10,
                },
              },
            }}
          />
        </FormGroup>

        <FormGroup>
          <h4>Line Chart</h4>
          <LineChart
            title="Monthly Data"
            data={[
              { label: "Jan", value: 1250 },
              { label: "Feb", value: 1450 },
              { label: "Mar", value: 1300 },
              { label: "Apr", value: 1650 },
              { label: "May", value: 1800 },
              { label: "Jun", value: 1550 },
            ]}
            width={400}
            height={250}
            tension={0.4}
            showLegend
            borderColor={["#FF8C4A"]}
            backgroundColor={["#FF8C4A"]}
            options={{
              plugins: {
                legend: {
                  position: "top",
                  align: "center",
                  labels: {
                    padding: 15,
                    boxWidth: 25,
                    boxHeight: 12,
                    usePointStyle: false,
                    font: {
                      size: 12,
                    },
                  },
                },
              },
              layout: {
                padding: {
                  bottom: 0,
                  top: 10,
                },
              },
            }}
          />
        </FormGroup>

        <FormGroup>
          <h4>Media Dropzone with preview carousel</h4>
          <MediaDropzoneCarousel
            title="Upload Media"
            media={media}
            accepts="image/*"
            fileTypes={["image/jpeg", "image/png", "image/jpg", "image/webp"]}
            onChange={(files: any) =>
              setMedia(Array.isArray(files) ? files : [])
            }
          />
        </FormGroup>

        <br />
      </ComponentsContainer>
    </DashboardLayout>
  );
};

export default ComponentsPage;
