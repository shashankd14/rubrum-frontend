import React from "react";
import { Input, Select, Button } from "antd";
import moment from "moment";

const Option = Select.Option;

/**
 * Table column definitions for the Cutting Details component
 * Extracted to improve code organization and maintainability
 */

export const getMainColumns = ({
  onInputChange,
  props,
  packetClassification,
  handleWeight,
  onUpdateClassificationWIP,
  page,
}) => [
    {
      title: "Plan No",
      dataIndex: "instructionId",
      key: "instructionId",
    },
    {
      title: "Plan date",
      dataIndex: "instructionDate",
      render(value) {
        return moment(value).format("DD/MM/YYYY");
      },
      key: "instructionDate",
    },
    {
      title: "Length",
      dataIndex: "plannedLength",
      render: (text, record, index) =>
        record?.instructionId ? (
          text
        ) : (
          <Input
            value={record?.plannedLength}
            onChange={onInputChange("plannedLength", index, record)}
          />
        ),
    },
    {
      title: "Actual Length",
      dataIndex: "actualLength",
      render: (text, record, index) => (
        <Input
          style={{ width: "60px" }}
          disabled={props.unfinish}
          value={record.actualLength}
          onChange={onInputChange("actualLength", index, record)}
        />
      ),
    },
    {
      title: "Width",
      dataIndex: "plannedWidth",
      render: (text, record, index) =>
        record?.instructionId ? (
          text
        ) : (
          <Input
            value={record?.plannedWidth}
            onChange={onInputChange("plannedWidth", index, record)}
          />
        ),
    },
    {
      title: "No of Sheets",
      dataIndex: "plannedNoOfPieces",
      render: (text, record, index) =>
        record?.instructionId ? (
          text
        ) : (
          <Input
            value={record?.plannedNoOfPieces}
            onChange={onInputChange("plannedNoOfPieces", index)}
          />
        ),
    },
    {
      title: "Actual No of Sheets",
      dataIndex: "actualNoOfPieces",
      render: (text, record, index) => (
        <Input
          style={{ width: "60px" }}
          disabled={props.unfinish}
          value={record.actualNoOfPieces}
          onChange={onInputChange("actualNoOfPieces", index, record)}
        />
      ),
    },
    {
      title: "Weight",
      dataIndex: "plannedWeight",
      key: "plannedWeight",
    },
    {
      title: "Actual Weight",
      dataIndex: "actualWeight",
      render: (text, record, index) => (
        <Input
          style={{ width: "120px" }}
          disabled={props.unfinish}
          value={record.actualWeight}
          onChange={onInputChange("actualWeight", index, record)}
          onBlur={() => {
            // This callback is passed from parent - actual weight calculation logic
            if (onInputChange.onBlurCallback) {
              onInputChange.onBlurCallback(record, index);
            }
          }}
        />
      ),
    },
    {
      title: "Classification",
      dataIndex: "packetClassification",
      render: (text, record, index) => {
        return (
          <div>
            <Select
              disabled={props.unfinish}
              dropdownMatchSelectWidth={false}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              style={{ width: "100%" }}
              value={
                record?.packetClassification?.classificationId ||
                record?.packetClassification?.tagId
              }
              onChange={onInputChange(
                "packetClassification",
                index,
                record,
                "select",
              )}
            >
              {packetClassification?.map((item) => {
                return (
                  <Option key={item.tagId} value={item.tagId}>
                    {item.tagName}
                  </Option>
                );
              })}
            </Select>

            {record?.process?.processId === 3 && (
              <Button
                className="icon icon-edit"
                onClick={() => onUpdateClassificationWIP(index, record)}
              >
                <i className="icon icon-edit gx-mr-1" />
              </Button>
            )}
          </div>
        );
      },
    },
    {
      title: "End User Tags",
      dataIndex: "endUserTags.tagName",
      render: (text, record, index) => {
        return (
          <Select
            disabled={props.unfinish}
            style={{ width: "100px" }}
            dropdownMatchSelectWidth={false}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => {
              return option?.props?.children
                ?.toLowerCase()
                .includes(input.toLowerCase());
            }}
            filterSort={(optionA, optionB) =>
              optionA?.props?.children
                .toLowerCase()
                .localeCompare(optionB?.props?.children.toLowerCase())
            }
            value={record?.endUserTagsentity?.tagId}
            onChange={onInputChange("endUserTagsentity", index, record, "select")}
          >
            {props?.coilDetails.party?.endUserTags?.map((item) => {
              return (
                <Option key={item.tagId} value={item.tagId}>
                  {item.tagName}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: "",
      render: (text, record) =>
        record?.instructionId ? (
          ""
        ) : (
          <a onClick={(e) => handleWeight(e, record)}>Save</a>
        ),
    },
  ];

export const getPlanColumns = ({
  page,
  packetClassification,
  handleClassificationChange,
  handleTagsChange,
  onEdit,
  setDeleteRecord,
  setshowDeleteModal,
  props,
}) => {
  const desiredTags = ['401 - WIP(FG)', '402 - WIP(EDGETRIM)', '403 - WIP(CUTENDS)', '404 - WIP SFG (CTL PENDING)', '405 - WIP PACKING ', '406 - WIP - QCH(RM DEFECT)', '407 - WIP - QCH(PROCESS DEFECT)', '408 - WIP - QCH(PLANNING DEFECT)'];

  return [
    {
      title: "Sr.No",
      dataIndex: "instructionId",
      key: "instructionId",
      render: (text, record, index) => {
        return (page - 1) * 10 + index + 1;
      },
    },
    {
      title: "Length",
      dataIndex: "plannedLength",
      key: "plannedLength",
    },
    {
      title: "No of Sheets",
      dataIndex: "plannedNoOfPieces",
      key: "plannedNoOfPieces",
    },
    {
      title: "Weight",
      dataIndex: "plannedWeight",
      key: "plannedWeight",
    },
    {
      title: "Classification",
      dataIndex: "packetClassification",
      render: (text, record, index) => {
        const filteredTags = packetClassification.filter((item) =>
          desiredTags.includes(item.tagName),
        );

        return (
          <Select
            disabled={props.unfinish}
            dropdownMatchSelectWidth={false}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            style={{ width: "100%" }}
            value={
              record?.packetClassification?.packetClassificationId ||
              record?.packetClassification?.classificationId ||
              record?.packetClassificationId
            }
            onChange={(value) =>
              handleClassificationChange(value, index, record)
            }
          >
            {filteredTags.map((item) => (
              <Option key={item.tagId} value={item.tagId}>
                {item.tagName}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: "End User Tags",
      dataIndex: "endUserTags.tagName",
      render: (text, record, index) => {
        return (
          <Select
            style={{ width: "100px" }}
            dropdownMatchSelectWidth={false}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => {
              return option?.props?.children
                ?.toLowerCase()
                .includes(input.toLowerCase());
            }}
            filterSort={(optionA, optionB) =>
              optionA?.props?.children
                .toLowerCase()
                .localeCompare(optionB?.props?.children.toLowerCase())
            }
            value={record?.endUserTagsentity?.tagId ?? record?.endUserTagId}
            onChange={(e) => handleTagsChange(record, e, "endUser")}
          >
            {props?.coilDetails.party?.endUserTags?.map((item) => {
              return (
                <Option value={item.tagId} key={item.tagId}>
                  {item.tagName}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record, index) => (
        <span>
          <i
            className="icon icon-edit"
            onClick={() => {
              onEdit(record, index);
            }}
          />{" "}
          <></>
          <i
            className="icon icon-trash"
            onClick={(e) => {
              setDeleteRecord({ e, record, type: "" });
              setshowDeleteModal(true);
            }}
          />
        </span>
      ),
      key: "action",
    },
    {
      title: "Process Date",
      dataIndex: "processDate",
      render: (value, record) => {
        if (record.process && record.process.processName === "CUTTING") {
          return moment(record.instructionDate).format("DD/MM/YYYY");
        } else {
          return moment(value).format("DD/MM/YYYY");
        }
      },
      key: "processDate",
    },
  ];
};

export const getSlitCutColumns = ({
  endUserTagList,
  handleTagsChange,
  setDeleteRecord,
  setshowDeleteModal,
}) => [
    {
      title: "Serial No",
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Length",
      dataIndex: "plannedLength",
      key: "plannedLength",
    },
    {
      title: "No of Cuts",
      dataIndex: "plannedNoOfPieces",
      key: "plannedNoOfPieces",
    },
    {
      title: "Weight",
      dataIndex: "plannedWeight",
      key: "plannedWeight",
    },
    {
      title: "Width",
      dataIndex: "plannedWidth",
      key: "plannedWidth",
    },
    {
      title: "End User Tags",
      dataIndex: "endUserTags.tagName",
      render: (text, record, index) => {
        return (
          <Select
            key={record.groupId}
            style={{ width: "100px" }}
            dropdownMatchSelectWidth={false}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => {
              return option?.props?.children
                ?.toLowerCase()
                .includes(input.toLowerCase());
            }}
            filterSort={(optionA, optionB) =>
              optionA?.props?.children
                .toLowerCase()
                .localeCompare(optionB?.props?.children.toLowerCase())
            }
            onChange={(e) => handleTagsChange(record, e, "endUser")}
          >
            {endUserTagList?.map((item) => {
              return (
                <Option value={item?.tagId} key={item?.tagId}>
                  {item?.tagName}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record, index) => (
        <span>
          <i
            className="icon icon-trash"
            onClick={(e) => {
              setDeleteRecord({ e, record, type: "slitCut" });
              setshowDeleteModal(true);
            }}
          />
        </span>
      ),
      key: "action",
    },
  ];

export const getSlitColumns = ({ page }) => [
  {
    title: "Serial No",
    key: "index",
    render: (text, record, index) =>
      page === 1 ? index + page : index + 1 + (page - 1) * 10,
  },
  {
    title: "Process Date",
    dataIndex: "processDate",
    render(value) {
      return moment(value).format("DD/MM/YYYY");
    },
    key: "processDate",
  },
  {
    title: "Length",
    dataIndex: "plannedLength",
    key: "plannedLength",
  },
  {
    title: "Width",
    dataIndex: "plannedWidth",
    key: "plannedWidth",
  },
  {
    title: "Weight",
    dataIndex: "plannedWeight",
    key: "plannedWeight",
  },
  {
    title: "End User Tags",
    dataIndex: "endUserTags.tagName",
    render: (text, record) => {
      return record.endUserTags?.tagName || record.endUserTagsentity?.tagName;
    },
  },
];

export const getYieldLossColumns = ({ page }) => [
  {
    title: "Sr. No",
    key: "index",
    render: (text, record, index) => (page - 1) * 10 + index + 1,
  },
  {
    title: "Location Name",
    dataIndex: "partyName",
    key: "partyName",
  },
  {
    title: "Loss Ratio from",
    dataIndex: "lossRatioPercentageFrom",
    key: "lossRatioPercentageFrom",
  },
  {
    title: "Loss Ratio to",
    dataIndex: "lossRatioPercentageTo",
    key: "lossRatioPercentageTo",
  },
  {
    title: "Comments",
    dataIndex: "comments",
    key: "comments",
  },
];
