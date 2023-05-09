# eip-content-based-router
An exploration of the Content-Based Router pattern from Enterprise Integration Patterns (https://tinyurl.com/ye2tuub2)
## Introduction

The Pipes and Filters pattern answers the following design prompt:
> How do we handle a situation where the implementation of a single logical function (e.g., inventory check) is spread across multiple physical systems?

The answer is embodied in this architecture: 

> "...Use a Content-Based Router to route each message to the correct recipient based on message content." - Enterpise Integration Patterns

## Pattern Summary
The Content-Based Router examines the message content and routes the message onto a different channel based on data contained in the message. The routing can be based on a number of criteria such as existence of fields, specific field values etc. 

## Implementation Diagram

![My implementation](https://placehold.it/400x400)


## Implementation Summary
In this exercise we process a list of records containing metadata about different flavors of ice cream and process the records with a Content-Based Router. The router inspects the incoming messages and identifies which messages contain information about whether a specific ice cream is kosher before forward messages to an appropriate filter. Messages (i.e. ice cream records) that are kosher routed to a kosher-specific filter and non-kosher messaes are routed to a filter that consumes non-kosher messages only.
